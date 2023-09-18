import { Link } from "preact-router/match";
import Button from "../Button";
import Typography from "../Typography";
import { useSignal } from "@preact/signals";
import { isUser } from "@/store/userState";
import { ordersList } from "@/api/user/orders/ordersList";
import { FulfillmentStatus, Order, PaymentStatus } from "@medusajs/medusa";
import { useEffect } from "preact/hooks";
import OrderItem from "../Orders/OrderItem";
import Loading from "../Loading";
import { adminOrdersList } from "@/api/admin/orders/ordersList";

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
              ["fulfilled", "partially_fulfilled"].includes(active)
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
              ["fulfilled", "partially_fulfilled"].includes(active)
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

  const toggleItems = [
    {
      title: "Pending",
      fulfillStatus: ["awaiting"],
    },
    {
      title: "Active",
      fulfillStatus: ["captured"],
    },
    {
      title: "Closed",
      fulfillStatus: ["fulfilled", "partially_fulfilled"],
    },
  ];

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
      <div className="flex justify-evenly items-center w-full my-2 bg-white p-2 shadow-lg rounded-2xl">
        {toggleItems.map((item) => (
          <Button
            type="button"
            variant="icon"
            onClick={() => (activeToggle.value = item.fulfillStatus)}
            className={`!rounded-2xl items-center capitalize ${
              JSON.stringify(activeToggle.value) ===
              JSON.stringify(item.fulfillStatus)
                ? "!bg-primary-700 text-white"
                : ""
            }`}
          >
            <span class="text-sm font-normal">{item.title}</span>
            <Typography
              size="body2/normal"
              variant="app-primary"
              className={`bg-primary-600/10 w-6 h-6 mx-1 items-center  justify-center rounded-full 
               ${
                 JSON.stringify(activeToggle.value) ===
                 JSON.stringify(item.fulfillStatus)
                   ? "!bg-white flex"
                   : "hidden"
               }
            `}
            >
              {isLoading.value ? "-" : orders.value?.length}
            </Typography>
          </Button>
        ))}
      </div>

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
