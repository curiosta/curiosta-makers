import { LineItem } from "@medusajs/medusa";
import Button from "../Button";
import Input from "../Input";
import { TReturnItem } from "@/api/user/orders/createReturn";
import { Signal, useSignal } from "@preact/signals";
import { ChangeEvent, useEffect } from "preact/compat";

type TReturnItemQty = {
  item: LineItem;
  requestReturnItems: Signal<TReturnItem[]>;
};

const ReturnItemQty = ({ item, requestReturnItems }: TReturnItemQty) => {
  const returnItem = useSignal<TReturnItem>({
    item_id: item.id,
    quantity: item.quantity,
  });
  // console.log(returnItem.value);

  const decreaseQty = () => {
    returnItem.value = { item_id: item.id, quantity: --item.quantity };
  };
  const increaseQty = () => {
    returnItem.value = { item_id: item.id, quantity: ++item.quantity };
  };
  const handleQty = async (e: ChangeEvent<HTMLInputElement>) => {
    const quantity = e.currentTarget.valueAsNumber;
    returnItem.value = { item_id: item.id, quantity };
  };

  // useEffect(() => {
  //   const exist = requestReturnItems.value.some(
  //     (val) => val.item_id === returnItem.value.item_id
  //   );
  //   console.log({ exist });
  //   if (!exist) {
  //     requestReturnItems.value = requestReturnItems.value.concat(
  //       returnItem.value
  //     );
  //   } else {
  //     requestReturnItems.value = [
  //       ...requestReturnItems.value,
  //       {
  //         item_id: returnItem.value.item_id,
  //         quantity: returnItem.value.quantity,
  //       },
  //     ];
  //   }
  // }, []);

  return (
    <div className={`flex flex-col gap-2 items-center relative `}>
      <div className="flex gap-2 items-center">
        {/* decrease cart quantity */}
        <Button
          type="button"
          variant="icon"
          className="w-8 h-8 items-center bg-primary-600/10 !rounded-full !p-0"
          onClick={decreaseQty}
          disabled={returnItem.value.quantity <= 1}
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

        <div className="w-12">
          <Input
            type="number"
            className={`text-center disabled:bg-gray-100`}
            value={returnItem.value?.quantity}
            onBlur={handleQty}
            disabled={
              returnItem.value.quantity >= item.variant.inventory_quantity
            }
          />
        </div>

        {/* increase cart quantity */}
        <Button
          type="button"
          variant="icon"
          className="w-8 h-8 items-center bg-primary-600/10  !rounded-full !p-0"
          onClick={increaseQty}
          disabled={
            returnItem.value.quantity >= item.variant.inventory_quantity
          }
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
      </div>
    </div>
  );
};

export default ReturnItemQty;
