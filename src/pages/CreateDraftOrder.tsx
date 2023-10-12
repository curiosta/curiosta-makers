import { adminProductList } from "@/api/admin/product/productList";
import AddProduct from "@/components/AddProduct";
import AddDraftItem from "@/components/AddProduct/AddDraftItem";
import Loading from "@/components/Loading";
import MultiSelectCheckbox from "@/components/MultiSelectCheckbox";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import OffsetPagination from "@/components/OffsetPagination";
import Radio from "@/components/Radio";
import SearchInput from "@/components/SearchInput";
import Select from "@/components/Select";
import Typography from "@/components/Typography";
import { ProductStatus } from "@medusajs/medusa";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { Link } from "preact-router";
import { ChangeEvent } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

type TLoadableOptions = "product:get";

export type TDraftOrderItems = {
  quantity: number;
  variant_id: string;
  metadata: { orderType: string };
};

const CreateDraftOrder = () => {
  const products = useSignal<PricedProduct[]>([]);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(20);
  const offset = useSignal<number>(0);
  const searchTerm = useSignal<string | undefined>(undefined);
  const dialogRef = useRef<HTMLDialogElement[]>([]);
  const selectedOrderType = useSignal<string | null>(null);
  const selectedVariantId = useSignal<string | null>(null);
  const selectedRefIndex = useSignal<number | null>(null);
  const draftOrderItems = useSignal<TDraftOrderItems[]>([]);

  const getProducts = async () => {
    isLoading.value = "product:get";
    try {
      const productRes = await adminProductList({
        q: searchTerm.value ? searchTerm.value : undefined,
        status: ["published"],
        limit: limit.value,
        offset: offset.value,
      });
      if (!productRes?.products?.length && productRes?.count) {
        offset.value = 0;
      }
      products.value = productRes?.products;
      count.value = productRes?.count;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    if (searchTerm.value) {
      const getData = setTimeout(() => {
        getProducts();
      }, 500);
      return () => clearTimeout(getData);
    }

    getProducts();
  }, [offset.value, searchTerm.value]);

  // handle dialog
  const handleDialog = (index: number, product: PricedProduct) => {
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
      selectedOrderType.value = value;
    }

    if (selectedVariantId.value && selectedOrderType.value) {
      try {
        draftOrderItems.value = [
          ...draftOrderItems.value,
          {
            quantity: 1,
            variant_id: selectedVariantId.value,
            metadata: { orderType: selectedOrderType.value },
          },
        ];
      } catch (error) {
        console.log(error);
      } finally {
        dialogRef.current[selectedRefIndex.value]?.close();
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Create order for user</Typography>
      </div>

      <SearchInput searchTerm={searchTerm} isSearchSort={false} />
      <Typography size="body1/normal">select product</Typography>
      <div className="text-center my-2 w-full mb-20">
        {isLoading.value !== "product:get" ? (
          products.value?.length ? (
            <div className="w-full flex flex-col  my-2 gap-4">
              {products.value.map((product, index) => (
                <div className="w-full flex justify-between items-center py-2 border-b last:border-none relative">
                  <Link
                    href={`/product/${product?.id}/${product?.handle}`}
                    className="flex items-center gap-2 w-1/2 z-10"
                  >
                    <img
                      src={product.thumbnail ?? "/images/placeholderImg.svg"}
                      alt={product.title}
                      className="w-12 h-12 object-cover"
                    />
                    <Typography
                      size="body1/normal"
                      className="text-start truncate  "
                    >
                      {product.title}
                    </Typography>
                  </Link>
                  {product.variants[0]?.inventory_quantity > 0 ? (
                    <AddDraftItem
                      product={product}
                      index={index}
                      isLoading={
                        isLoading.value === "product:get" ? true : false
                      }
                      handleDialog={handleDialog}
                      draftOrderItems={draftOrderItems}
                    />
                  ) : (
                    <Typography variant="error">Out of stock</Typography>
                  )}

                  {/* close on outside click */}
                  <div
                    className={`w-full h-full absolute  ${dialogRef.current[index]?.open}`}
                    onClick={() => {
                      dialogRef.current[index]?.close();
                    }}
                  />
                  <dialog
                    ref={(e) => (dialogRef.current[index] = e)}
                    className="absolute translate-x-full p-2 shadow-lg rounded-md z-10"
                  >
                    {isLoading.value === "product:get" ? (
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
          ) : !products.value?.length && count.value ? (
            <div className="w-full h-40 ">
              <Loading loadingText="loading" />
            </div>
          ) : (
            <Typography className="w-full">Product not found</Typography>
          )
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default CreateDraftOrder;
