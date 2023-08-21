import { useSignal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import { LineItem } from "@medusajs/medusa";
import cart from "@/api/cart";
import Input from "../Input";
import { ChangeEvent } from "preact/compat";

const ManageQty = ({ productItem }: { productItem: LineItem }) => {
  const loadingQty = useSignal<boolean>(false);
  const loadingInputQty = useSignal<boolean>(false);
  const errorMessage = useSignal<string | null>(null);

  const increaseQty = async () => {
    loadingQty.value = true;
    errorMessage.value = null;
    try {
      await cart.setItemQuantity(productItem.id, productItem.quantity + 1);
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      loadingQty.value = false;
    }
  };
  const decreaseQty = async () => {
    loadingQty.value = true;
    errorMessage.value = null;
    try {
      await cart.setItemQuantity(productItem.id, productItem.quantity - 1);
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      loadingQty.value = false;
    }
  };

  const handleQty = async (e: ChangeEvent<HTMLInputElement>) => {
    const quantity = e.currentTarget.valueAsNumber;
    errorMessage.value = null;
    loadingInputQty.value = true;
    try {
      await cart.setItemQuantity(productItem.id, quantity);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      loadingInputQty.value = false;
    }
  };

  const isCartPage = window.location.pathname === "/cart";

  return (
    <div
      className={`flex flex-col gap-2 items-center relative  ${
        cart.loading.value === "cart:line_items:remove" && "grayscale"
      }`}
    >
      <div className="flex gap-2 items-center">
        {/* decrease cart quantity */}
        <Button
          type="button"
          variant="icon"
          className="w-8 h-8 items-center bg-primary-600/10 !rounded-full !p-0"
          onClick={decreaseQty}
          disabled={loadingQty.value}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 stroke-primary-600"
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
            class={"animate-spin w-6 stroke-primary-600 duration-500"}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        ) : (
          <div className="w-12">
            <Input
              type="number"
              className={`text-center ${
                loadingInputQty.value ? "bg-gray-100" : ""
              }`}
              value={productItem.quantity}
              onBlur={handleQty}
              disabled={loadingInputQty.value}
            />
          </div>
        )}

        {/* increase cart quantity */}
        <Button
          type="button"
          variant="icon"
          className="w-8 h-8 items-center bg-primary-600/10  !rounded-full !p-0"
          onClick={increaseQty}
          disabled={loadingQty.value}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 stroke-primary-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Button>

        {/* Remove cart items */}
        <Button
          type="button"
          variant="icon"
          className="!p-0"
          onClick={() => cart.removeItem(productItem.id)}
          disabled={cart.loading.value === "cart:line_items:remove"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 stroke-danger-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </Button>
      </div>

      {!isCartPage ? (
        <Typography size="body2/normal" className="capitalize">
          {productItem.metadata?.cartType} Request
        </Typography>
      ) : null}

      <div
        className={`absolute ${
          isCartPage ? "top-full" : "-bottom-4"
        }  rounded-lg shadow-xl p-1.5 bg-secondray z-10 ${
          errorMessage.value ? "block" : "hidden"
        }`}
      >
        <Typography size="small/semi-bold" variant="error">
          {errorMessage.value}
        </Typography>
      </div>
    </div>
  );
};

export default ManageQty;
