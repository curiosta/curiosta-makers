import { Signal } from "@preact/signals";
import Button from "@components/Button";
import Typography from "@components/Typography";

type TToggle = {
  activeToggle: Signal<string>;
  isLoading: boolean;
  count: number;
  toggleItems: string[];
};

const Toggle = ({ activeToggle, toggleItems, isLoading, count }: TToggle) => {
  return (
    <div className="flex justify-evenly items-center my-2 px-4 gap-10 bg-gray-200/50 p-2 shadow-lg rounded-2xl">
      {toggleItems.map((item) => (
        <Button
          type="button"
          variant="icon"
          onClick={() => {
            activeToggle.value = item;
          }}
          className={`!rounded-2xl items-center capitalize ${
            activeToggle.value === item ? "!bg-primary-700 text-white" : ""
          }`}
        >
          <span class="text-sm ">{item}</span>
          <Typography
            size="body2/normal"
            variant="app-primary"
            className={`bg-primary-600/10 w-6 h-6 mx-1 items-center  justify-center rounded-full 
       ${activeToggle.value === item ? "!bg-white flex" : "hidden"}
    `}
          >
            {isLoading ? "-" : count}
          </Typography>
        </Button>
      ))}
    </div>
  );
};
export default Toggle;
