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

  return (
    <div className="w-full my-4">
      <div className="flex justify-between items-center">
        <Typography>Recently Issued Items</Typography>
        <Link href={"#"} className="text-app-primary-600">
          View All
        </Link>
      </div>
      <div className="flex justify-between items-center w-full my-2 bg-white p-2 shadow-sm rounded-2xl">
        {toggleItems.map((item, index) => (
          <Button
            key={index}
            type="button"
            variant="icon"
            onClick={() => (activeIndex.value = index)}
            className={`!rounded-3xl  ${
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

      <div></div>
    </div>
  );
};

export default IssuedItems;
