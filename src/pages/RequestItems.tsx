import { listProducts } from "@/api/product/listProducts";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import OffsetPagination from "@components/OffsetPagination";
import Radio from "@/components/Radio";
import { ChangeEvent } from "preact/compat";
import cart from "@/api/cart";
import AddProduct from "@/components/AddProduct";
import ViewCartLayer from "@/components/ViewCartLayer";
import { Link } from "preact-router";
import user from "@/api/user";
import PopUp from "@/components/Popup";

interface Props {
  id: string;
}

const RequestItems = ({ id }: Props) => {
  const products = useSignal<PricedProduct[]>([]);
  const isLoading = useSignal<boolean>(false);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(9);
  const offset = useSignal<number>(0);
  const dialogRef = useRef<HTMLDialogElement[]>([]);
  const selectedCartType = useSignal<string | null>(null);
  const selectedVariantId = useSignal<string | null>(null);
  const selectedRefIndex = useSignal<number | null>(null);
  const isProfileCompletePopUp = useSignal<boolean>(false);

  const getProducts = async () => {
    isLoading.value = true;

    try {
      const response = await listProducts({
        category_id: [id],
        limit: limit.value,
        offset: offset.value,
      });
      products.value = response?.products;
      count.value = response?.count;
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    getProducts();
  }, [offset.value]);

  // handle dialog
  const handleDialog = (index: number, product: PricedProduct) => {
    const { shipping_addresses, phone } = user.customer.value;
    const isProfileComplete = shipping_addresses?.length > 0 && phone !== null;

    if (!isProfileComplete) {
      return (isProfileCompletePopUp.value = true);
    }
    dialogRef.current.map((val, i) => i != index && val?.close());
    if (dialogRef.current[index]?.open) {
      dialogRef.current[index]?.close();
    } else {
      dialogRef.current[index]?.show();
    }
    selectedRefIndex.value = index;
    selectedVariantId.value = product.variants[0].id;
  };

  // handle radio input and add line items with selected cart type value
  const handleRadioInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.currentTarget;
    if (checked) {
      selectedCartType.value = value;
    }

    if (selectedVariantId.value && selectedCartType.value) {
      try {
        await cart.addItem({
          id: selectedVariantId.value,
          metadata: { cartType: selectedCartType.value },
        });
      } catch (error) {
        console.log(error);
      } finally {
        dialogRef.current[selectedRefIndex.value]?.close();
      }
    }
  };
  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Request Items</Typography>
      </div>

      <div className="text-center my-2 w-full mb-12 max-w-2xl">
        <Typography className="capitalize">Choose items</Typography>

        {!isLoading.value ? (
          <div className="mb-20">
            {products.value.map((product, index) => (
              <div
                key={product?.id}
                className="flex justify-between items-center gap-4 my-3 py-2 border-b last:border-none relative"
              >
                <Link
                  href={`/product/${product?.id}/${product?.handle}`}
                  className="flex gap-2 w-1/2 z-10"
                >
                  <img
                    src={product.thumbnail ?? "/images/placeholderImg.svg"}
                    alt={product.title}
                    className="w-8 h-8 object-cover"
                  />
                  <Typography
                    size="body1/normal"
                    className="text-start truncate w-44"
                  >
                    {product?.title}
                  </Typography>
                </Link>
                {product.variants[0]?.inventory_quantity > 0 ? (
                  <AddProduct
                    product={product}
                    index={index}
                    handleDialog={handleDialog}
                  />
                ) : (
                  <Typography variant="error">Out of stock</Typography>
                )}

                {/* close on outside click */}
                <div
                  className={`w-full h-full absolute  ${dialogRef.current[index]?.open}`}
                  onClick={() => {
                    if (cart.loading.value !== "cart:line_items:add") {
                      dialogRef.current[index]?.close();
                    }
                  }}
                />
                <dialog
                  ref={(e) => (dialogRef.current[index] = e)}
                  className="absolute translate-x-full p-2 shadow-lg sm:left-2/3 rounded-md z-10"
                >
                  {cart.loading.value === "cart:line_items:add" ? (
                    <Typography
                      size="body2/normal"
                      className="flex flex-col items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class={
                          "animate-spin w-6 stroke-primary-600 duration-500"
                        }
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                      Please Wait...
                    </Typography>
                  ) : (
                    <>
                      <Radio
                        name="add-method"
                        label="Issue"
                        value="issue"
                        onChange={handleRadioInput}
                      />
                      <Radio
                        name="add-method"
                        label="Borrow"
                        value="borrow"
                        onChange={handleRadioInput}
                      />
                    </>
                  )}
                </dialog>
              </div>
            ))}
            <OffsetPagination limit={limit} offset={offset} count={count} />
          </div>
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}
        <ViewCartLayer actionText="View Cart" actionLink="/cart" />
      </div>
      <PopUp
        isPopup={isProfileCompletePopUp}
        actionText="Check profile"
        actionLink={`/user/${user.customer.value?.id}`}
        title="Please complete your profile first!"
        subtitle="Add your phone no. and address before request any item"
      />
      <BottomNavbar />
    </div>
  );
};

export default RequestItems;
