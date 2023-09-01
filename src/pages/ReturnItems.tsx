import { adminApproveReturn } from "@/api/admin/orders/approveReturn";
import { adminGetOrders } from "@/api/admin/orders/getOrder";
import { TReturnItem, createReturn } from "@/api/user/orders/createReturn";
import { getOrders } from "@/api/user/orders/getOrder";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Typography from "@/components/Typography";
import { isUser } from "@/store/userState";
import { Order, Return } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

type Props = {
  order_id: string;
  return_id: string;
};
type TLoadableOptions = "order:get" | "order:return";

const ReturnItems = ({ order_id, return_id }: Props) => {
  const order = useSignal<Order | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const isRequestReturn = useSignal<boolean>(false);
  const returnItem = useSignal<Return | null>(null);

  const getOrderInfo = async () => {
    isLoading.value = "order:get";
    try {
      const res = isUser.value
        ? await getOrders(order_id)
        : await adminGetOrders(order_id);
      order.value = res?.order;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };
  useEffect(() => {
    getOrderInfo();
  }, [order_id]);

  // filter out fulfilled items
  const fulfilledItemId = order.value?.fulfillments?.flatMap((fulfill) =>
    fulfill.items.map((item) => item.item_id)
  );

  const fulfilledItem = order.value?.items.filter((item) =>
    fulfilledItemId.includes(item.id)
  );

  // if item fulfilled then only it can return
  const borrowItems = fulfilledItem?.filter(
    (item) => item.metadata?.cartType === "borrow"
  );

  const handleReqestReturn = async () => {
    isLoading.value = "order:return";
    try {
      const returnItems: TReturnItem[] = [];
      borrowItems?.map((item) =>
        returnItems.push({ item_id: item.id, quantity: item.quantity })
      );
      const res = await createReturn(order_id, returnItems);
      returnItem.value = res?.return;
      isRequestReturn.value = true;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  const handleApproveReturn = async () => {
    isLoading.value = "order:return";
    try {
      const returnItems: TReturnItem[] = [];
      borrowItems?.map((item) =>
        returnItems.push({ item_id: item.id, quantity: item.quantity })
      );
      const res = await adminApproveReturn(return_id, returnItems);
      returnItem.value = res?.return;
      isRequestReturn.value = true;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Return items</Typography>
      </div>
      {isLoading.value !== "order:get" ? (
        borrowItems?.length ? (
          <div className="w-full">
            <div className="flex justify-between p-2 px-8 shadow rounded-lg w-full bg-secondray">
              <Typography size="h6/normal">Items</Typography>
              <Typography size="h6/normal">Quantity</Typography>
            </div>
            <div className="w-full">
              {borrowItems?.map((item) => (
                <div className="flex justify-between items-center my-3 py-2 border-b last:border-none">
                  <div className="flex gap-2 items-center">
                    <img
                      src={item.thumbnail || "N/A"}
                      alt={item.title}
                      className="w-10 h-10 object-cover"
                    />
                    <Typography size="body1/normal" className="text-start">
                      {item.title}
                    </Typography>
                  </div>
                  <Typography className="pr-8">x{item.quantity}</Typography>
                </div>
              ))}
              <div className="flex items-center justify-center">
                {isUser.value ? (
                  order.value?.returns?.at(0)?.status !== "requested" ? (
                    <Button type="button" onClick={handleReqestReturn}>
                      Request Return
                    </Button>
                  ) : (
                    <div className="flex flex-col items-center gap-4 ">
                      <Typography size="body2/normal">
                        Already return requested
                      </Typography>
                      <Button
                        link={`/orders/${order.value?.id}`}
                        variant="secondary"
                      >
                        Check status
                      </Button>
                    </div>
                  )
                ) : (
                  <div>
                    {!order.value?.fulfillment_status.includes("returned") ? (
                      <Button type="button" onClick={handleApproveReturn}>
                        Approve Return
                      </Button>
                    ) : (
                      <Typography>Already Approved</Typography>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Typography className="mt-8" size="body2/normal">
            No item for return
          </Typography>
        )
      ) : (
        <div className="h-40">
          <Loading loadingText="loading" />
        </div>
      )}
      {isLoading.value === "order:return" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : (
        <PopUp
          title={
            isUser.value
              ? "Return request is placed successfully"
              : "Return request is approved successfully"
          }
          subtitle={`Request ID: ${returnItem.value?.id} `}
          isPopup={isRequestReturn}
          actionText="Check status"
          actionLink={`/orders/${order.value?.id}`}
        />
      )}
      <BottomNavbar />
    </div>
  );
};

export default ReturnItems;
