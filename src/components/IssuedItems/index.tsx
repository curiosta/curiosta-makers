import { Link } from "preact-router/match";
import Button from "../Button";
import Typography from "../Typography";
import { useSignal } from "@preact/signals";
import { isUser } from "@/store/userState";
import { ordersList } from "@/api/user/orders/ordersList";
import { Order } from "@medusajs/medusa";
import { useEffect } from "preact/hooks";
import OrderItem from "../Orders/OrderItem";
import Loading from "../Loading";
import { adminOrdersList } from "@/api/admin/orders/ordersList";

const IssuedItems = () => {
  const activeToggle = useSignal<string>("pending");
  const orders = useSignal<Order[]>([]);
  const isLoading = useSignal<boolean>(false);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(3);
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
  }, []);

  const toggleItems = ["pending", "closed"];

  const usersIssuedItems = [
    {
      date: "27th May 2023 11:10:08 AM",
      items: [
        {
          title: "Issue Requests",
          quantity: 4,
        },
        {
          title: "Unique items",
          quantity: 14,
        },
        {
          title: "Qty Requested",
          quantity: 1,
        },
        {
          title: "Borrow Requests",
          quantity: 4,
        },
        {
          title: "Unique items",
          quantity: 14,
        },
        {
          title: "Qty Requested",
          quantity: 1,
        },
      ],
    },
    {
      date: "27th May 2023 11:10:08 AM",
      items: [
        {
          title: "Issue Requests",
          quantity: 4,
        },
        {
          title: "Unique items",
          quantity: 14,
        },
        {
          title: "Qty Requested",
          quantity: 1,
        },
        {
          title: "Borrow Requests",
          quantity: 4,
        },
        {
          title: "Unique items",
          quantity: 14,
        },
        {
          title: "Qty Requested",
          quantity: 1,
        },
      ],
    },
  ];

  const ordersFilter = orders.value.filter((orders) =>
    orders.status.toLowerCase().includes(activeToggle.value.toLowerCase())
  );

  return (
    <div className="w-full my-4">
      <div className="flex justify-between items-center">
        <Typography>Recently Issued Items</Typography>
        <Link href="/orders" className="text-app-primary-600">
          View All
        </Link>
      </div>
      <div className="flex justify-evenly items-center w-full my-2 bg-white p-2 shadow-lg rounded-2xl">
        {toggleItems.map((item) => (
          <Button
            type="button"
            variant="icon"
            onClick={() => (activeToggle.value = item)}
            className={`!rounded-2xl items-center capitalize ${
              activeToggle.value === item ? "!bg-primary-700 text-white" : ""
            }`}
          >
            <span class="text-sm font-normal">{item}</span>
            <Typography
              size="body2/normal"
              variant="app-primary"
              className={`bg-primary-600/10 w-6 h-6 mx-1 items-center  justify-center rounded-full 
               ${activeToggle.value === item ? "!bg-white flex" : "hidden"}
            `}
            >
              {ordersFilter.length}
            </Typography>
          </Button>
        ))}
      </div>

      {!isLoading.value ? (
        <div className="w-full flex flex-col gap-4 mb-12 ">
          {ordersFilter?.map((order) => (
            <OrderItem order={order} page="home" />
          ))}
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
