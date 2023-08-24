import { adminGetOrders } from "@/api/admin/orders/getOrder";
import { adminFulfillment } from "@/api/admin/orders/orderFulfil";
import { adminUpdateOrder } from "@/api/admin/orders/updateOrder";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Typography from "@/components/Typography";
import { LineItem, Order } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

type Props = {
  id: string;
};

type PickedItem = {
  item_id: string;
  quantity: number;
};

type TLoadableOptions = "order:get" | "order:update" | "order:fulfill";

const PickItems = ({ id }: Props) => {
  const order = useSignal<Order | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const isPopup = useSignal<boolean>(false);
  const isFulfillComplete = useSignal<boolean>(false);
  const errorMessage = useSignal<string>("");

  const pickedItems = useSignal<PickedItem[]>([]);

  const getOrderInfo = async () => {
    isLoading.value = "order:get";
    try {
      const res = await adminGetOrders(id);
      order.value = res?.order;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    getOrderInfo();
  }, [id]);

  // filter out fulfilled items
  const fulfilledItemId = order.value?.fulfillments?.flatMap((fulfill) =>
    fulfill.items.map((item) => item.item_id)
  );

  const notFulfilledItem = order.value?.items.filter(
    (item) => !fulfilledItemId.includes(item.id)
  );

  const handlePick = (item: LineItem) => {
    pickedItems.value = [
      ...pickedItems.value,
      { item_id: item.id, quantity: item.quantity },
    ];
  };

  const handleUpdateOrder = async () => {
    if (errorMessage.value) {
      errorMessage.value = "";
    }
    isLoading.value = "order:update";
    try {
      await adminUpdateOrder(id);
      isPopup.value = true;
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = undefined;
    }
  };

  const handleFulfill = async () => {
    if (errorMessage.value) {
      errorMessage.value = "";
    }
    isLoading.value = "order:fulfill";
    try {
      const fulfill = await adminFulfillment(id, pickedItems.value);
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
    <div className="flex flex-col justify-center items-center   p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Pick Items</Typography>
      </div>
      <Typography size="body1/normal" className="w-full truncate">
        Pick Id {id}
      </Typography>
      {isLoading.value !== "order:get" ? (
        <div className="w-full">
          {notFulfilledItem?.length ? (
            <div className="flex flex-col gap-4 my-2 mb-12">
              {notFulfilledItem?.map((item, index) => (
                <div className="w-full bg-secondray shadow-lg rounded-2xl p-4">
                  <Typography size="small/normal">Item {index + 1}</Typography>
                  <div className="flex gap-2 border-b">
                    <img
                      src={item.thumbnail || "N/A"}
                      alt={item.title}
                      className="w-8 object-cover"
                    />
                    <Typography size="body1/normal" className="text-start">
                      {item.title}
                    </Typography>
                  </div>
                  <div className="grid grid-cols-5 w-full items-center my-2">
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
                    <Typography>Zone A</Typography>
                    <Typography>Aisle 1</Typography>
                    <Typography>Rack 1</Typography>
                    <Typography className="whitespace-nowrap">
                      Bin CA01
                    </Typography>
                  </div>
                  <div className="flex items-center w-full justify-evenly gap-2 ">
                    <div className="flex items-center gap-2">
                      <Typography>Qty</Typography>
                      <Chip className="!bg-gray-100 !rounded-md ">
                        {item.quantity}
                      </Chip>
                    </div>
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
                    ) : (
                      <Button type="button" onClick={() => handlePick(item)}>
                        Pick
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div className="w-full flex justify-center my-2">
                <Button
                  type="button"
                  onClick={handleUpdateOrder}
                  disabled={!pickedItems.value.length}
                >
                  {isLoading.value === "order:update"
                    ? "Please wait.."
                    : "Update order"}
                </Button>
              </div>
            </div>
          ) : (
            <Typography className="mt-8 text-center">
              No item for pick
            </Typography>
          )}
        </div>
      ) : (
        <div className="h-40">
          <Loading loadingText="loading" />
        </div>
      )}
      {isLoading.value === "order:fulfill" ? null : (
        <PopUp
          title={`To Be Picked item${
            notFulfilledItem?.length > 1 ? "s" : ""
          }:- ${notFulfilledItem?.length}`}
          subtitle={`Actual Picked item${
            pickedItems.value?.length > 1 ? "s" : ""
          }:- ${pickedItems.value?.length} `}
          actionText="Fullfil"
          handlePopupAction={handleFulfill}
          isPopup={isPopup}
          errorMessage={errorMessage.value}
        />
      )}

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
  );
};

export default PickItems;
