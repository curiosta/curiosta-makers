import { getOrders } from "@/api/user/orders/getOrder";
import { Order } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import TopNavbar from "@components/Navbar/TopNavbar";
import Typography from "@components/Typography";
import Loading from "@components/Loading";
import BottomNavbar from "@components/Navbar/BottomNavbar";
import { isUser } from "@/store/userState";
import { adminGetOrders } from "@/api/admin/orders/getOrder";
import Button from "@components/Button";
import { isPopup } from "@/store/popUpState";
import PopUp from "@components/Popup";

interface Props {
  id: string;
}

const OrderInfo = ({ id }: Props) => {
  const order = useSignal<Order | null>(null);
  const isLoading = useSignal<boolean>(false);

  const getOrderInfo = async () => {
    isLoading.value = true;
    try {
      const res = isUser.value ? await getOrders(id) : await adminGetOrders(id);
      order.value = res?.order;
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    getOrderInfo();
  }, [id]);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Order items</Typography>
      </div>
      <div className="w-full flex flex-col gap-4 mb-12 ">
        {!isLoading.value ? (
          <div className="w-full">
            <div className="my-2">
              <Typography size="small/normal" variant="secondary">
                Requested-{" "}
                {new Date(order.value?.created_at).toLocaleString("en-US", {
                  timeStyle: "medium",
                  dateStyle: "full",
                })}
              </Typography>
              <div className="flex items-center justify-between">
                <Typography size="body1/normal">
                  Order ID:{" "}
                  {order.value?.id.substring(order.value?.id.length - 5)}
                </Typography>
                <Typography size="body1/normal" className="capitalize">
                  Status: {order.value?.status}
                </Typography>
              </div>
            </div>

            <div className="flex justify-between p-2 px-8 shadow rounded-lg w-full bg-secondray">
              <Typography size="h6/normal">Items</Typography>
              <Typography size="h6/normal">Quantity</Typography>
            </div>

            {order.value?.items?.map((item) => (
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

            {!isUser.value ? (
              <div className="w-full flex items-center justify-evenly mt-8">
                <Button type="button" onClick={() => (isPopup.value = true)}>
                  Approve
                </Button>
                <Button type="button" variant="danger">
                  Reject
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}
      </div>
      <PopUp
        title="Request is approved and picking task is created successfully"
        subtitle={`Pick Task id ${order.value?.id}`}
        actionText="Start Picking"
        actionLink={`/pick-items/${order.value?.id}`}
        isPopup={isPopup}
      />
      <BottomNavbar />
    </div>
  );
};

export default OrderInfo;
