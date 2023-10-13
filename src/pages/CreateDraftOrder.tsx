import { adminCreateDraftOrder } from "@/api/admin/orders/createDraftOrder";
import { adminMarkPaidDraftOrder } from "@/api/admin/orders/markPaidDraftOrder";
import { adminProductList } from "@/api/admin/product/productList";
import { listRegion } from "@/api/user/region/listRegion";
import AddDraftItem from "@/components/AddProduct/AddDraftItem";
import Button from "@/components/Button";
import DraftOrderUserInfo from "@/components/DraftOrderUserInfo";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import OffsetPagination from "@/components/OffsetPagination";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Radio from "@/components/Radio";
import SearchInput from "@/components/SearchInput";
import Typography from "@/components/Typography";
import { Customer, Order, Region } from "@medusajs/medusa";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { Link } from "preact-router";
import { ChangeEvent } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

type TLoadableOptions = "product:get" | "create:order";

export type TDraftOrderItems = {
  quantity: number;
  variant_id: string;
  metadata: { cartType: string };
};

const CreateDraftOrder = () => {
  const products = useSignal<PricedProduct[]>([]);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(10);
  const offset = useSignal<number>(0);
  const searchTerm = useSignal<string | undefined>(undefined);
  const dialogRef = useRef<HTMLDialogElement[]>([]);
  const selectedOrderType = useSignal<string | null>(null);
  const selectedVariantId = useSignal<string | null>(null);
  const selectedRefIndex = useSignal<number | null>(null);
  const draftOrderItems = useSignal<TDraftOrderItems[]>([]);
  const selectedUserEmail = useSignal<string | undefined>(undefined);
  const selectedUser = useSignal<Customer | undefined>(undefined);
  const errorMessage = useSignal<string | undefined>(undefined);
  const createDraftSteps = useSignal<number>(1);
  const orderInfo = useSignal<Order | null>(null);
  const isDraftOrderPaid = useSignal<boolean>(false);

  const getProducts = async () => {
    isLoading.value = "product:get";
    try {
      const productRes = await adminProductList({
        q: searchTerm.value ? searchTerm.value : undefined,
        status: ["published"],
        limit: limit.value,
        offset: offset.value,
      });
      if (!productRes?.products?.length && productRes?.count) {
        offset.value = 0;
      }
      products.value = productRes?.products;
      count.value = productRes?.count;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    if (searchTerm.value) {
      const getData = setTimeout(() => {
        getProducts();
      }, 500);
      return () => clearTimeout(getData);
    }

    getProducts();
  }, [offset.value, searchTerm.value]);

  // handle dialog
  const handleDialog = (index: number, product: PricedProduct) => {
    dialogRef.current.map((val, i) => i != index && val?.close());
    if (dialogRef.current[index]?.open) {
      dialogRef.current[index]?.close();
    } else {
      dialogRef.current[index]?.show();
    }
    selectedRefIndex.value = index;
    selectedVariantId.value = product.variants[0].id;
  };

  // handle radio input and add line items with selected cart type value
  const handleRadioInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.currentTarget;
    if (checked) {
      selectedOrderType.value = value;
    }

    if (selectedVariantId.value && selectedOrderType.value) {
      try {
        draftOrderItems.value = [
          ...draftOrderItems.value,
          {
            quantity: 1,
            variant_id: selectedVariantId.value,
            metadata: { cartType: selectedOrderType.value },
          },
        ];
      } catch (error) {
        console.log(error);
      } finally {
        dialogRef.current[selectedRefIndex.value]?.close();
      }
    }
  };

  // handle create order for user
  const handleCreateOrder = async () => {
    isLoading.value = "create:order";
    errorMessage.value = undefined;
    try {
      if (!selectedUser.value) return;
      const { email, billing_address, billing_address_id, id } =
        selectedUser.value;
      if (!billing_address_id) {
        isLoading.value = undefined;
        throw new Error(
          "This user don't have any default address!\n Ask user to add default address first."
        );
      }
      const regionRes = await listRegion();
      const regions: Region[] = regionRes?.regions;
      const countryCodes = billing_address.country_code;
      const regionId = regions?.find((region) =>
        countryCodes.includes(region.countries[0]?.iso_2)
      )?.id;
      const draftOrderRes = await adminCreateDraftOrder({
        email: email,
        address: billing_address_id,
        items: draftOrderItems.value,
        region_id: regionId,
        customer_id: id,
      });

      const draftOrderId = draftOrderRes?.draft_order?.id;
      const markPaidRes = await adminMarkPaidDraftOrder(draftOrderId);
      orderInfo.value = markPaidRes?.order;
      isDraftOrderPaid.value = true;
      handleReset();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = undefined;
    }
  };

  // handle reset
  const handleReset = () => {
    draftOrderItems.value = [];
    selectedUserEmail.value = undefined;
    selectedUser.value = undefined;
    errorMessage.value = undefined;
    createDraftSteps.value = 1;
  };

  const disabledBtn = !selectedUser.value || !draftOrderItems.value?.length;

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Create order for user</Typography>
      </div>
      <div className="flex justify-center items-center gap-2 my-4">
        {Array(2)
          .fill(1)
          .map((val, indicatorIndex) => (
            <span
              className={`${
                createDraftSteps.value === indicatorIndex + 1
                  ? "bg-primary-700"
                  : "bg-primary-100"
              } w-6 h-1  rounded-2xl`}
            ></span>
          ))}
      </div>
      {createDraftSteps.value === 1 ? (
        <div className="w-full mb-20">
          <SearchInput
            searchTerm={searchTerm}
            placeholder="Search item..."
            isSearchSort={false}
          />
          <div className="text-center my-2 w-full ">
            <Typography size="body1/semi-bold">1. Select Item</Typography>
            {isLoading.value !== "product:get" ? (
              products.value?.length ? (
                <div className="w-full flex flex-col  my-2 gap-4">
                  {products.value.map((product, index) => (
                    <div className="w-full flex justify-between items-center py-2 relative">
                      <Link
                        href={`/product/${product?.id}/${product?.handle}`}
                        className="flex items-center gap-2 w-1/2 z-10"
                      >
                        <img
                          src={
                            product.thumbnail ?? "/images/placeholderImg.svg"
                          }
                          alt={product.title}
                          className="w-12 h-12 object-cover"
                        />
                        <Typography
                          size="body1/normal"
                          className="text-start truncate  "
                        >
                          {product.title}
                        </Typography>
                      </Link>
                      {product.variants[0]?.inventory_quantity > 0 ? (
                        <AddDraftItem
                          product={product}
                          index={index}
                          isLoading={
                            isLoading.value === "product:get" ? true : false
                          }
                          handleDialog={handleDialog}
                          draftOrderItems={draftOrderItems}
                        />
                      ) : (
                        <Typography variant="error">Out of stock</Typography>
                      )}

                      {/* close on outside click */}
                      <div
                        className={`w-full h-full absolute  ${dialogRef.current[index]?.open}`}
                        onClick={() => {
                          dialogRef.current[index]?.close();
                        }}
                      />
                      <dialog
                        ref={(e) => (dialogRef.current[index] = e)}
                        className="absolute translate-x-full p-2 shadow-lg rounded-md z-10"
                      >
                        {isLoading.value === "product:get" ? (
                          <Typography
                            size="body2/normal"
                            className="flex flex-col items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class={
                                "animate-spin w-6 stroke-primary-600 duration-500"
                              }
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                              />
                            </svg>
                            Please Wait...
                          </Typography>
                        ) : (
                          <>
                            <Radio
                              name="add-method"
                              label="Issue"
                              value="issue"
                              onChange={handleRadioInput}
                            />
                            <Radio
                              name="add-method"
                              label="Borrow"
                              value="borrow"
                              onChange={handleRadioInput}
                            />
                          </>
                        )}
                      </dialog>
                    </div>
                  ))}
                  <OffsetPagination
                    limit={limit}
                    offset={offset}
                    count={count}
                  />
                </div>
              ) : !products.value?.length && count.value ? (
                <div className="w-full h-40 ">
                  <Loading loadingText="loading" />
                </div>
              ) : (
                <Typography className="w-full my-4" variant="error">
                  Item not found
                </Typography>
              )
            ) : (
              <div className="h-40">
                <Loading loadingText="loading" />
              </div>
            )}
          </div>
          <div className="w-full flex justify-end items-center border-t pt-4">
            <Button
              onClick={() => (createDraftSteps.value = 2)}
              disabled={!draftOrderItems.value?.length}
            >
              Next step
            </Button>
          </div>
        </div>
      ) : null}
      {createDraftSteps.value === 2 ? (
        <div className="w-full mb-16">
          <DraftOrderUserInfo
            selectedUser={selectedUser}
            selectedUserEmail={selectedUserEmail}
          />
          {errorMessage.value ? (
            <Typography
              variant="error"
              className="text-center my-8 whitespace-break-spaces"
            >
              {errorMessage.value}
            </Typography>
          ) : null}

          <div className="w-full flex justify-between items-center">
            <Button onClick={() => (createDraftSteps.value = 1)}>
              Prev step
            </Button>
            <div className="flex items-center justify-end gap-4">
              <Button type="button" variant="danger" onClick={handleReset}>
                Reset
              </Button>
              <Button
                type="button"
                onClick={handleCreateOrder}
                disabled={disabledBtn}
              >
                Create Order
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      {isLoading.value === "create:order" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : (
        <PopUp
          title="Order is placed successfully"
          subtitle={`Order ID: ${orderInfo.value?.id}`}
          actionText="Check status"
          actionLink={`/orders/${orderInfo.value?.id}`}
          isPopup={isDraftOrderPaid}
        />
      )}
      <BottomNavbar />
    </div>
  );
};

export default CreateDraftOrder;
