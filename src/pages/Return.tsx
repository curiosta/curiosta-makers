import { ordersList } from "@/api/user/orders/ordersList";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import OrderItem from "@/components/Orders/OrderItem";
import Typography from "@/components/Typography";
import { Order, Return } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import OffsetPagination from "@components/OffsetPagination";
import { isUser } from "@/store/userState";
import { adminReturnsList } from "@/api/admin/orders/returnsList";

const Returns = () => {
  const orders = useSignal<Order[]>([]);
  const isLoading = useSignal<boolean>(false);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(9);
  const offset = useSignal<number>(0);
  const returns = useSignal<Return[]>([]);

  const getOrdersList = async () => {
    isLoading.value = true;
    try {
      const res = isUser.value
        ? await ordersList({
            payment_status: ["captured"],
            fulfillment_status: ["fulfilled", "partially_fulfilled"],
            limit: limit.value,
            offset: offset.value,
          })
        : await adminReturnsList({ limit: limit.value, offset: offset.value });
      count.value = res?.count;
      {
        isUser.value
          ? (orders.value = res?.orders)
          : (returns.value = res?.returns);
      }
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    getOrdersList();
  }, [offset.value]);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Return</Typography>
      </div>
      <div className="w-full mb-12 sm:w-3/4">
        {!isLoading.value ? (
          isUser.value ? (
            orders.value?.length ? (
              <div className="w-full flex flex-col gap-4 mb-12 ">
                {orders.value?.map((order) => (
                  <OrderItem order={order} page="return" />
                ))}
                <OffsetPagination limit={limit} offset={offset} count={count} />
              </div>
            ) : (
              <Typography>No order found</Typography>
            )
          ) : returns.value?.length ? (
            <div className="w-full flex flex-col gap-4 mb-12 ">
              {returns.value?.map((returnVal) => (
                <OrderItem returnVal={returnVal} page="adminReturn" />
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
    </div>
  );
};

export default Returns;
