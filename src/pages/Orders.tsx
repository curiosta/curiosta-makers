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
import { adminGetOrders } from "@/api/admin/orders/getOrder";
import { adminOrdersList } from "@/api/admin/orders/ordersList";

const Orders = () => {
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

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Orders</Typography>
      </div>

      {!isLoading.value ? (
        <div className="w-full flex flex-col gap-4 mb-12 ">
          {orders.value?.map((order) => (
            <OrderItem order={order} page="orders" />
          ))}
          <OffsetPagination limit={limit} offset={offset} count={count} />
        </div>
      ) : (
        <div className="h-40">
          <Loading loadingText="loading" />
        </div>
      )}
      <BottomNavbar />
    </div>
  );
};

export default Orders;
