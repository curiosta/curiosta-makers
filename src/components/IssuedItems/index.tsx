import { Link } from "preact-router/match";
import Typography from "@components/Typography";
import { useSignal } from "@preact/signals";
import { isUser } from "@/store/userState";
import { ordersList } from "@/api/user/orders/ordersList";
import { Order } from "@medusajs/medusa";
import { useEffect } from "preact/hooks";
import OrderItem from "@components/Orders/OrderItem";
import Loading from "@components/Loading";
import { adminOrdersList } from "@/api/admin/orders/ordersList";
import OrderStatusToggle from "@components/Orders/OrderStatusToggle";

const IssuedItems = () => {
  const activeToggle = useSignal<string[]>(["awaiting"]);
  const orders = useSignal<Order[]>([]);
  const isLoading = useSignal<boolean>(false);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(10);
  const offset = useSignal<number>(0);

  const getOrdersList = async () => {
    isLoading.value = true;
    try {
      const res = isUser.value
        ? await ordersList({
            payment_status: activeToggle.value.some((active) =>
              ["awaiting", "captured"].includes(active)
            )
              ? activeToggle.value
              : [],
            fulfillment_status: activeToggle.value.some((active) =>
              [
                "fulfilled",
                "partially_fulfilled",
                "partially_returned",
                "returned",
                "canceled",
              ].includes(active)
            )
              ? activeToggle.value
              : activeToggle.value.some((active) =>
                  ["captured"].includes(active)
                )
              ? ["not_fulfilled"]
              : [],
            limit: limit.value,
            offset: offset.value,
          })
        : await adminOrdersList({
            payment_status: activeToggle.value.some((active) =>
              ["awaiting", "captured"].includes(active)
            )
              ? activeToggle.value
              : [],
            fulfillment_status: activeToggle.value.some((active) =>
              [
                "fulfilled",
                "partially_fulfilled",
                "partially_returned",
                "returned",
                "canceled",
              ].includes(active)
            )
              ? activeToggle.value
              : activeToggle.value.some((active) =>
                  ["captured"].includes(active)
                )
              ? ["not_fulfilled"]
              : [],
            limit: limit.value,
            offset: offset.value,
          });

      count.value = res?.count;
      orders.value = res?.orders;
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    getOrdersList();
  }, [activeToggle.value]);

  return (
    <div className="w-full my-4">
      <div className="flex justify-between items-center">
        {isUser.value ? (
          <Typography>Recently Requested</Typography>
        ) : (
          <Typography>Recently User's Requests</Typography>
        )}
        <Link href="/orders" className="text-app-primary-600">
          View All
        </Link>
      </div>
      <OrderStatusToggle
        activeToggle={activeToggle}
        orders={orders}
        isLoading={isLoading.value ? true : false}
      />

      {!isLoading.value ? (
        <div className="w-full flex flex-col gap-4 mb-12">
          {orders.value?.length ? (
            orders.value?.map((order) => (
              <OrderItem order={order} page="home" />
            ))
          ) : (
            <Typography>No Item found</Typography>
          )}
        </div>
      ) : (
        <div className="h-40">
          <Loading loadingText="loading" />
        </div>
      )}
    </div>
  );
};

export default IssuedItems;
