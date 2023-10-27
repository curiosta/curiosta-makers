import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import Button from "../Button";
import cart from "@/api/cart";
import ManageQty from "../ManageQty";
import { draftOrderItems } from "@/store/draftOrderStore";
import { isUser } from "@/store/userState";

type TAddProduct = {
  product: PricedProduct;
  index: number;
  handleDialog: (index: number, product: PricedProduct) => void;
};

const AddProduct = ({ product, index, handleDialog }: TAddProduct) => {
  const isProductItemInCart = cart.store.value?.items?.find(
    (item) => item?.variant.product_id === product.id
  );
  const draftItem = !isUser.value
    ? draftOrderItems.value?.find(
        (item) => item?.variant_id === product.variants[0]?.id
      )
    : null;

  return (
    <div className="z-10">
      {cart.loading.value === "cart:get" ? (
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
      ) : isUser.value ? (
        !isProductItemInCart ? (
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
          <ManageQty productItem={isProductItemInCart} page="request" />
        )
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
          productItem={isProductItemInCart}
          draftItem={draftItem}
          inventoryQty={product.variants[0]?.inventory_quantity}
          page="request"
        />
      )}
    </div>
  );
};

export default AddProduct;
