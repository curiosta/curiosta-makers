import { useSignal } from "@preact/signals";
import Button from "@components/Button";
import Typography from "@components/Typography";
import { LineItem } from "@medusajs/medusa";
import cart from "@/api/cart";
import Input from "@components/Input";
import { ChangeEvent } from "preact/compat";
import {
  TDraftOrderItems,
  draftOrderItems,
  selectedUser,
} from "@/store/draftOrderStore";
import { isUser } from "@/store/userState";

type TManageQty = {
  productItem?: LineItem;
  page: "cart" | "request" | "draftOrder";
  draftItem?: TDraftOrderItems;
  inventoryQty?: number;
};

const ManageQty = ({
  productItem,
  page,
  draftItem,
  inventoryQty,
}: TManageQty) => {
  const loadingQty = useSignal<boolean>(false);
  const loadingInputQty = useSignal<boolean>(false);
  const errorMessage = useSignal<string | null>(null);

  const increaseQty = async () => {
    loadingQty.value = true;
    errorMessage.value = null;
    try {
      if (!isUser.value) {
        if (inventoryQty <= draftItem.quantity) {
          throw new Error(`Cannot set quantity exceeding ${inventoryQty} !.`);
        }
        const updatedData = draftOrderItems.value?.map((item) =>
          item.variant_id === draftItem.variant_id
            ? { ...item, quantity: draftItem.quantity + 1 }
            : item
        );
        draftOrderItems.value = updatedData;
      } else {
        await cart.setItemQuantity(productItem.id, productItem.quantity + 1);
      }
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
      if (!isUser.value) {
        if (draftItem.quantity <= 1) {
          throw new Error("Cannot set quantity less than 1.");
        }
        const updatedData = draftOrderItems.value?.map((item) =>
          item.variant_id === draftItem.variant_id
            ? { ...item, quantity: draftItem.quantity - 1 }
            : item
        );
        draftOrderItems.value = updatedData;
      } else {
        await cart.setItemQuantity(productItem.id, productItem.quantity - 1);
      }
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
      if (!isUser.value) {
        if (inventoryQty < quantity) {
          throw new Error(`Cannot set quantity exceeding ${inventoryQty} !.`);
        }
        if (quantity < 1) {
          throw new Error("Cannot set quantity less than 1.");
        }
        const updatedData = draftOrderItems.value?.map((item) =>
          item.variant_id === draftItem.variant_id
            ? { ...item, quantity: quantity }
            : item
        );
        draftOrderItems.value = updatedData;
      } else {
        await cart.setItemQuantity(productItem.id, quantity);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      loadingInputQty.value = false;
    }
  };

  const handleDeleteDraftItem = () => {
    const updatedData = draftOrderItems.value?.filter(
      (item) => item.variant_id !== draftItem.variant_id
    );
    draftOrderItems.value = updatedData;
    if (!draftOrderItems.value?.length) {
      selectedUser.value = null;
    }
  };

  localStorage.setItem(
    "draftOrderItems",
    JSON.stringify(draftOrderItems.value)
  );
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
              value={!isUser.value ? draftItem.quantity : productItem.quantity}
              onBlur={handleQty}
              disabled={loadingInputQty.value}
              min={1}
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
          onClick={() =>
            !isUser.value
              ? handleDeleteDraftItem()
              : cart.removeItem(productItem.id)
          }
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

      {page !== "cart" ? (
        <Typography size="body2/normal" className="capitalize">
          {!isUser.value
            ? draftItem.metadata?.cartType
            : productItem.metadata?.cartType}{" "}
          Request
        </Typography>
      ) : null}

      {/* close on outside click */}
      <div
        className={`w-full h-full absolute ${
          errorMessage.value ? "z-10" : "-z-10"
        } `}
        onClick={() => {
          errorMessage.value = null;
        }}
      />
      <div
        className={`absolute ${
          page !== "cart" ? "bottom-full" : "top-full"
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
