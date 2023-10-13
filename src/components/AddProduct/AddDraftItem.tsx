import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import Button from "../Button";
import ManageQty from "../ManageQty";
import { Signal } from "@preact/signals";
import { TDraftOrderItems } from "@pages/CreateDraftOrder";

type TAddDraftItem = {
  product: PricedProduct;
  index: number;
  isLoading: boolean;
  handleDialog: (index: number, product: PricedProduct) => void;
  draftOrderItems: Signal<TDraftOrderItems[]>;
};

const AddDraftItem = ({
  product,
  index,
  handleDialog,
  isLoading,
  draftOrderItems,
}: TAddDraftItem) => {
  const draftItem = draftOrderItems.value?.find(
    (item) => item?.variant_id === product.variants[0]?.id
  );

  return (
    <div className="z-10">
      {isLoading ? (
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
      ) : !draftItem ? (
        <Button
          type="button"
          variant="secondary"
          className="!w-20 border-2 !rounded-lg uppercase"
          onClick={() => {
            handleDialog(index, product);
          }}
        >
          Add
        </Button>
      ) : (
        <ManageQty
          draftOrderItems={draftOrderItems}
          draftItem={draftItem}
          inventoryQty={product.variants[0]?.inventory_quantity}
          page="draftOrder"
        />
      )}
    </div>
  );
};

export default AddDraftItem;
