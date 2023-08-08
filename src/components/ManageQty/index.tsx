import { useSignal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";

const ManageQty = () => {
  const loadingQty = useSignal<boolean>(false);

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        {/* decrease cart quantity */}
        <Button
          type="button"
          variant="icon"
          className="w-4 !p-0"
          // onClick={decreaseQty}
          disabled={loadingQty.value}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-4 stroke-primary-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 12h-15"
            />
          </svg>
        </Button>

        {/* quantity / loading */}
        {loadingQty.value ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class={"animate-spin w-4 stroke-primary-600 duration-500"}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        ) : (
          <Typography variant="app-primary" size="body1/normal">
            {1}
          </Typography>
        )}

        {/* increase cart quantity */}
        <Button
          type="button"
          variant="icon"
          className="w-4 !p-0"
          // onClick={increaseQty}
          disabled={loadingQty.value}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-4 stroke-primary-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default ManageQty;
