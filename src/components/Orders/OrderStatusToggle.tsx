import { Signal } from "@preact/signals";
import Button from "@components/Button";
import Typography from "@components/Typography";
import { Order } from "@medusajs/medusa";

type TOrderStatusToggle = {
  activeToggle: Signal<string[]>;
  isLoading: boolean;
  orders: Signal<Order[]>;
  count?: number;
};

const OrderStatusToggle = ({
  activeToggle,
  isLoading,
  orders,
  count,
}: TOrderStatusToggle) => {
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
      fulfillStatus: [
        "fulfilled",
        "partially_fulfilled",
        "partially_returned",
        "returned",
        "canceled",
      ],
    },
  ];
  return (
    <div className="flex justify-evenly items-center w-full my-2 bg-white p-2 shadow-lg rounded-2xl">
      {toggleItems.map((item) => (
        <Button
          type="button"
          variant="icon"
          onClick={() => {
            activeToggle.value = item.fulfillStatus;
          }}
          className={`!rounded-2xl items-center capitalize px-3 ${
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
            {isLoading ? "-" : count ? count : orders.value?.length}
          </Typography>
        </Button>
      ))}
    </div>
  );
};

export default OrderStatusToggle;
