import { Link } from "preact-router/match";
import Button from "../Button";
import Typography from "../Typography";
import { useSignal } from "@preact/signals";
import { Order } from "@medusajs/medusa";
import { useEffect } from "preact/hooks";
import OrderItem from "../Orders/OrderItem";
import Loading from "../Loading";
import { adminOrdersList } from "@/api/admin/orders/ordersList";

const UserReturnRequest = () => {
  const activeToggle = useSignal<string[]>(["requested"]);
  const orders = useSignal<Order[]>([]);
  const isLoading = useSignal<boolean>(false);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(4);
  const offset = useSignal<number>(0);

  const getOrdersList = async () => {
    isLoading.value = true;
    try {
      const res = await adminOrdersList({
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
  }, []);

  const toggleItems = [
    {
      title: "Pending",
      returnStatus: ["requested"],
    },
    {
      title: "Closed",
      returnStatus: ["received"],
    },
  ];

  const ordersFilter = orders.value.filter((order) =>
    activeToggle.value.includes(order.returns?.at(0)?.status)
  );

  return (
    <div className="w-full my-4">
      <div className="flex justify-between items-center">
        <Typography>User Return Requests</Typography>
        <Link href="/return" className="text-app-primary-600">
          View All
        </Link>
      </div>
      <div className="flex justify-evenly items-center w-full my-2 bg-white p-2 shadow-lg rounded-2xl">
        {toggleItems.map((item) => (
          <Button
            type="button"
            variant="icon"
            onClick={() => (activeToggle.value = item.returnStatus)}
            className={`!rounded-2xl items-center capitalize ${
              JSON.stringify(activeToggle.value) ===
              JSON.stringify(item.returnStatus)
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
                 JSON.stringify(item.returnStatus)
                   ? "!bg-white flex"
                   : "hidden"
               }
            `}
            >
              {ordersFilter.length}
            </Typography>
          </Button>
        ))}
      </div>

      {!isLoading.value ? (
        <div className="w-full flex flex-col gap-4 mb-12 ">
          {ordersFilter.length ? (
            ordersFilter?.map((order) => (
              <OrderItem order={order} page="adminReturn" />
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

export default UserReturnRequest;
