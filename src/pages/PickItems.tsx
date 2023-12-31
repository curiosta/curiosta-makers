import { adminListCategory } from "@/api/admin/category/listCategory";
import { adminGetOrders } from "@/api/admin/orders/getOrder";
import { adminFulfillment } from "@/api/admin/orders/orderFulfil";
import { TShortItem } from "@/api/admin/orders/updateItemsQty";
import { adminGetProduct } from "@/api/admin/product/getProduct";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import ShortClosePopup from "@/components/Popup/ShortClosePopup";
import Typography from "@/components/Typography";
import nestedSet from "@/utils/convertIntoNestedLocations";
import { LineItem, Order, ProductCategory, Product } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { Link } from "preact-router";
import { ChangeEvent } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

type Props = {
  id: string;
};

type PickedItem = {
  item_id: string;
  quantity: number;
};

type TLoadableOptions =
  | "order:get"
  | "order:update"
  | "order:fulfill"
  | "category:get"
  | "locations:get";

const PickItems = ({ id }: Props) => {
  const order = useSignal<Order | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const isPopup = useSignal<boolean>(false);
  const isFulfillComplete = useSignal<boolean>(false);
  const errorMessage = useSignal<string>("");
  const selectedItem = useSignal<
    | (Omit<LineItem, "beforeInsert"> & {
        categories?: ProductCategory[];
      })
    | null
  >(null);

  const pickedItems = useSignal<PickedItem[]>([]);
  const shortItems = useSignal<TShortItem[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const productsList = useSignal<
    (Product & { locations?: { name: string; id: string }[] })[]
  >([]);
  const locationCategory = useSignal<ProductCategory[]>([]);

  const getOrderInfo = async () => {
    isLoading.value = "order:get";
    try {
      const res = await adminGetOrders(id);
      order.value = res?.order;
      getLocationCategory();
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  const getLocationCategory = async () => {
    isLoading.value = "locations:get";
    try {
      const categoryRes = await adminListCategory({
        q: "location-master",
        limit: 0,
        offset: 0,
      });
      locationCategory.value =
        categoryRes?.product_categories?.at(0)?.category_children;
      getProductInfo();
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  // set location tree
  const setNodes = (location: ProductCategory[]) => {
    location?.forEach((parent) => {
      if (parent.category_children?.length) {
        parent.category_children.forEach((child) => {
          nestedSet.addNode(child?.name, parent.name, child.id);
          if (child.category_children?.length) {
            setNodes(child.category_children);
          }
        });
      }
      setNodes(parent.category_children);
    });
  };

  useEffect(() => {
    setNodes(locationCategory.value);
  }, [locationCategory.value]);

  const getProductInfo = async () => {
    const productIds = order.value?.items?.map(
      (item) => item.variant?.product_id
    );

    if (!productIds) return;
    const productPromises = productIds.map((productId) =>
      adminGetProduct({ productId: productId })
    );

    const res = await Promise.allSettled(productPromises);

    const products = res
      .filter((response) => response.status === "fulfilled")
      ?.map<Product & { locations?: { name: string; id: string }[] }>(
        (response: any) => response.value.product
      );

    productsList.value = products?.map((product) => {
      // location categories
      const chidLocation = product.categories.filter((c) =>
        c.handle.startsWith("loc:")
      );

      // show locations in this format "Zone A / Aisle A / Rack A / Bin CA01"
      if (Object.keys(nestedSet.nodes)?.length) {
        const locations = chidLocation?.map((location) => {
          return {
            name: nestedSet
              .getAllParents(location.name)
              .reverse()
              .concat(location.name)
              .join(" / "),
            id: location.id,
          };
        });
        product.locations = locations;
      }

      // actual categories
      product.categories = product.categories.filter(
        (c) => !c.handle.startsWith("loc:")
      );
      return product;
    });
  };

  useEffect(() => {
    getOrderInfo();
  }, [id]);

  // filter out fulfilled items
  const fulfilledItemId = order.value?.fulfillments?.flatMap((fulfill) =>
    fulfill.items.map((item) => item.item_id)
  );

  let notFulfilledItem: (LineItem & {
    categories?: ProductCategory[];
  })[] = order.value?.items.filter(
    (item) => !fulfilledItemId.includes(item.id)
  );

  const ordersWithCategory = notFulfilledItem?.map((item) => {
    const filteredProductList = productsList.value.filter(
      (product) => product?.id === item.variant?.product_id
    );
    const product = filteredProductList[0];

    return {
      ...item,
      categories: product?.categories,
      locations: product?.locations,
    };
  });

  const handlePick = ({ id, quantity }: { id: string; quantity: number }) => {
    pickedItems.value = [
      ...pickedItems.value,
      { item_id: id, quantity: quantity },
    ];
  };

  const handleShortClose = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const quantity = formData.get("actual_qty");
    shortItems.value = [
      ...shortItems.value,
      {
        item_id: selectedItem.value.id,
        quantity: parseInt(quantity as string),
      },
    ];
    isPopup.value = false;
  };

  const handleFulfill = async () => {
    if (errorMessage.value) {
      errorMessage.value = "";
    }
    isLoading.value = "order:fulfill";
    const fulfillItems = [...shortItems.value, ...pickedItems.value];
    try {
      const fulfill = await adminFulfillment(id, fulfillItems);
      order.value = fulfill?.order;
      isFulfillComplete.value = true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("status code 400")) {
          errorMessage.value = "Order has been already fulfilled";
        }
      }
    } finally {
      isLoading.value = undefined;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Pick Items</Typography>
      </div>
      <div className="w-full mb-12 max-w-2xl">
        <Typography size="body1/normal" className="w-full truncate">
          Pick Id {id}
        </Typography>
        {isLoading.value !== "order:get" ? (
          <div className="w-full">
            {ordersWithCategory?.length ? (
              <div className="flex flex-col gap-4 my-2 mb-12">
                {ordersWithCategory?.map((item, index) => (
                  <div className="w-full bg-secondary shadow-lg rounded-2xl p-4">
                    <Typography size="small/normal">
                      Item {index + 1}
                    </Typography>
                    <Link
                      href={`/product/${item.variant.product_id}`}
                      className="flex gap-2 border-b"
                    >
                      <img
                        src={item.thumbnail ?? "/images/placeholderImg.svg"}
                        alt={item.title}
                        className="w-8 object-cover"
                      />
                      <Typography
                        size="body1/normal"
                        className="text-start truncate w-56 sm:w-3/4"
                      >
                        {item.title}
                      </Typography>
                    </Link>
                    <div className="flex gap-2 w-full items-center my-2">
                      <Button type="button" variant="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M9 5.72727C7.19182 5.72727 5.72727 7.19182 5.72727 9C5.72727 10.8082 7.19182 12.2727 9 12.2727C10.8082 12.2727 12.2727 10.8082 12.2727 9C12.2727 7.19182 10.8082 5.72727 9 5.72727ZM16.3145 8.18182C15.9382 4.77 13.23 2.06182 9.81818 1.68545V0H8.18182V1.68545C4.77 2.06182 2.06182 4.77 1.68545 8.18182H0V9.81818H1.68545C2.06182 13.23 4.77 15.9382 8.18182 16.3145V18H9.81818V16.3145C13.23 15.9382 15.9382 13.23 16.3145 9.81818H18V8.18182H16.3145ZM9 14.7273C5.83364 14.7273 3.27273 12.1664 3.27273 9C3.27273 5.83364 5.83364 3.27273 9 3.27273C12.1664 3.27273 14.7273 5.83364 14.7273 9C14.7273 12.1664 12.1664 14.7273 9 14.7273Z"
                            fill="black"
                          />
                        </svg>
                      </Button>
                      {item?.locations ? (
                        item?.locations?.length ? (
                          item.locations?.map((location) => (
                            <Typography>{location.name}</Typography>
                          ))
                        ) : (
                          <Typography
                            variant="error"
                            className="whitespace-nowrap"
                          >
                            No Location found
                          </Typography>
                        )
                      ) : null}
                    </div>
                    <div className="flex items-center w-full justify-between gap-2 ">
                      <div className="flex items-center gap-2">
                        <Typography>Qty</Typography>
                        <Chip className="!bg-gray-100 !rounded-md ">
                          {item.quantity}
                        </Chip>
                      </div>
                      {shortItems.value?.some(
                        (short) => short.item_id === item.id
                      ) ? (
                        <div className="flex items-center ">
                          <Typography size="small/normal">Short Qty</Typography>
                          <Chip className="!bg-gray-100 !rounded-md text-sm">
                            {
                              shortItems.value?.find(
                                (short) => short.item_id === item.id
                              )?.quantity
                            }
                          </Chip>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-4">
                        {pickedItems.value?.some(
                          (val) => val.item_id === item.id
                        ) ? (
                          <Button
                            type="button"
                            variant="secondary"
                            className="items-center gap-3"
                            onClick={() =>
                              (pickedItems.value = pickedItems.value.filter(
                                (val) => val.item_id !== item.id
                              ))
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                            >
                              <path
                                d="M4.45455 7.6194L1.11364 4.79851L0 5.73881L4.45455 9.5L14 1.4403L12.8864 0.5L4.45455 7.6194Z"
                                fill="#0B7278"
                              />
                            </svg>
                            Picked
                          </Button>
                        ) : shortItems.value?.some(
                            (val) => val.item_id === item.id
                          ) ? null : (
                          <Button
                            type="button"
                            onClick={() => handlePick(item)}
                          >
                            Pick
                          </Button>
                        )}

                        {shortItems.value?.some(
                          (val) => val.item_id === item.id
                        ) ? (
                          <Button
                            type="button"
                            variant="secondary"
                            className="items-center gap-3 !ring-danger-600 !border-danger-600 !text-danger-600"
                            onClick={() =>
                              (shortItems.value = shortItems.value.filter(
                                (val) => val.item_id !== item.id
                              ))
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                              className="stroke-current"
                            >
                              <path
                                d="M4.45455 7.6194L1.11364 4.79851L0 5.73881L4.45455 9.5L14 1.4403L12.8864 0.5L4.45455 7.6194Z"
                                fill="#0B7278"
                              />
                            </svg>
                            Short Closed
                          </Button>
                        ) : pickedItems.value?.some(
                            (val) => val.item_id === item.id
                          ) ? null : (
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => {
                              isPopup.value = true;
                              selectedItem.value = item;
                            }}
                            disabled={item.quantity <= 1}
                          >
                            Short close
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="w-full flex justify-center my-2">
                  <Button
                    type="button"
                    onClick={handleFulfill}
                    disabled={
                      !pickedItems.value?.length && !shortItems.value?.length
                    }
                  >
                    Fulfil
                  </Button>
                </div>
              </div>
            ) : (
              <Typography className="mt-8 text-center">
                No item for fulfill
              </Typography>
            )}
          </div>
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}
        <ShortClosePopup
          isPopup={isPopup}
          actionText="okay"
          selectedItem={selectedItem}
          formRef={formRef}
          handlePopupAction={handleShortClose}
        />
        {isLoading.value === "order:fulfill" && !isFulfillComplete.value ? (
          <LoadingPopUp loadingText="Please wait" />
        ) : (
          <PopUp
            title="Request is fulfilled successfully"
            subtitle={`Fulfilled ID: ${order.value?.fulfillments?.[0]?.id} `}
            isPopup={isFulfillComplete}
            actionText="Check status"
            actionLink={`/orders/${order.value?.id}`}
          />
        )}
        <BottomNavbar />
      </div>
    </div>
  );
};

export default PickItems;
