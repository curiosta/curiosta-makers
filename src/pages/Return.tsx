import { ordersList } from "@/api/user/orders/ordersList";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import OrderItem from "@/components/Orders/OrderItem";
import Typography from "@/components/Typography";
import { Order } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import OffsetPagination from "@components/OffsetPagination";
import { isUser } from "@/store/userState";
import { adminOrdersList } from "@/api/admin/orders/ordersList";

const Return = () => {
  const orders = useSignal<Order[]>([]);
  const isLoading = useSignal<boolean>(false);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(9);
  const offset = useSignal<number>(0);

  const getOrdersList = async () => {
    isLoading.value = true;
    try {
      const res = isUser.value
        ? await ordersList({
            limit: limit.value,
            offset: offset.value,
          })
        : await adminOrdersList({ limit: limit.value, offset: offset.value });
      count.value = res?.count;
      orders.value = res?.orders;
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    getOrdersList();
  }, [offset.value]);

  // filter out only returns orders
  const returnOrders = orders.value?.filter(
    (order) => order.returns?.at(0)?.status === "requested"
  );

  // filter out not returns orders
  const requestReturnOrder = orders.value?.filter(
    (order) =>
      !order.returns?.length &&
      order.payment_status !== "canceled" &&
      order.fulfillment_status !== "not_fulfilled" &&
      order.items?.some((item) => item.metadata?.cartType === "borrow")
  );

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Return</Typography>
      </div>

      {!isLoading.value ? (
        requestReturnOrder?.length && returnOrders?.length ? (
          <div className="w-full flex flex-col gap-4 mb-12 ">
            {isUser.value
              ? requestReturnOrder?.map((order) => (
                  <OrderItem order={order} page="return" />
                ))
              : returnOrders?.map((order) => (
                  <OrderItem order={order} page="adminReturn" />
                ))}
            <OffsetPagination limit={limit} offset={offset} count={count} />
          </div>
        ) : (
          <Typography>No order found</Typography>
        )
      ) : (
        <div className="h-40">
          <Loading loadingText="loading" />
        </div>
      )}
      <BottomNavbar />
    </div>
  );
};

export default Return;
