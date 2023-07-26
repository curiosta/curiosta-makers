import { Link } from "preact-router/match";
import Button from "../Button";
import Typography from "../Typography";
import { useSignal } from "@preact/signals";

const IssuedItems = () => {
  const activeIndex = useSignal<number>(0);

  const toggleItems = [
    {
      title: "Pending",
      count: 3,
    },
    {
      title: "Active",
      count: 30,
    },
    {
      title: "Closed",
      count: 10,
    },
  ];

  const requestedItems = [
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

  return (
    <div className="w-full my-4">
      <div className="flex justify-between items-center">
        <Typography>Recently Issued Items</Typography>
        <Link href={"#"} className="text-app-primary-600">
          View All
        </Link>
      </div>
      <div className="flex justify-between items-center w-full my-2 bg-white p-2 shadow-lg rounded-2xl">
        {toggleItems.map((item, index) => (
          <Button
            key={index}
            type="button"
            variant="icon"
            onClick={() => (activeIndex.value = index)}
            className={`!rounded-3xl items-center ${
              activeIndex.value === index ? "!bg-primary-700 text-white" : ""
            }`}
          >
            <span class="text-sm font-normal">{item.title}</span>
            <Typography
              size="body2/normal"
              variant="app-primary"
              className={`bg-primary-600/10 w-6 h-6 mx-1 items-center justify-center rounded-full ${
                item.count ? "flex" : "hidden"
              } ${activeIndex.value === index ? "!bg-white" : ""}
            `}
            >
              {item.count}
            </Typography>
          </Button>
        ))}
      </div>

      {requestedItems.map((requestedItem) => (
        <div className="w-full my-2 bg-white p-4 shadow-lg rounded-2xl last:mb-12">
          <div className="flex justify-between items-center">
            <Typography size="body2/normal" variant="secondary">
              Requested at {requestedItem.date}
            </Typography>
            <Button type="button" variant="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {requestedItem.items.map((item) => (
              <div>
                <Typography size="body2/normal" variant="secondary">
                  {item.title}
                </Typography>
                <Typography size="body2/normal" variant="primary">
                  {item.quantity}
                </Typography>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-4 gap-4">
            <Button type="button" className="!px-3 !w-fit">
              View Details
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="!px-3 !py-3 !w-fit"
            >
              Return
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssuedItems;
