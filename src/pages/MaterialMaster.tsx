import { adminProductList } from "@/api/admin/product/productList";
import Button from "@/components/Button";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import OffsetPagination from "@components/OffsetPagination";
import Loading from "@/components/Loading";
import Dialog from "@/components/Dialog";
import { Link } from "preact-router";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import { adminDeleteProduct } from "@/api/admin/product/deleteProduct";
import SearchInput from "@/components/SearchInput";

type TLoadableOptions =
  | "product:get"
  | "product:add"
  | "product:edit"
  | "product:delete";
const MaterialMaster = () => {
  const products = useSignal<PricedProduct[]>([]);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(20);
  const offset = useSignal<number>(0);
  const dialogRef = useRef<HTMLDialogElement[]>([]);
  const isPopup = useSignal<boolean>(false);
  const searchTerm = useSignal<string | undefined>(undefined);

  const getProducts = async () => {
    isLoading.value = "product:get";
    try {
      const productRes = await adminProductList({
        q: searchTerm.value ? searchTerm.value : undefined,
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
  const handleDialog = (index: number) => {
    dialogRef.current.map((val, i) => i != index && val?.close());
    if (dialogRef.current[index]?.open) {
      dialogRef.current[index]?.close();
    } else {
      dialogRef.current[index]?.show();
    }
  };

  const handleDelete = async (id: string, index: number) => {
    isLoading.value = "product:delete";
    try {
      await adminDeleteProduct(id);
      dialogRef.current[index]?.close();
      getProducts();
      isPopup.value = false;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Material Master</Typography>
      </div>
      <SearchInput searchTerm={searchTerm} isSearchSort={false} />

      <div className="text-center my-2 w-full mb-20">
        <div className="flex justify-end">
          <Button link="/material-master/add" className="gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 stroke-secondray stroke-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add
          </Button>
        </div>
        {isLoading.value !== "product:get" ? (
          products.value?.length ? (
            <div className="w-full flex flex-col  my-2 gap-4">
              {products.value.map((product, index) => (
                <div className="w-full flex justify-between items-center relative">
                  <div className="flex items-center gap-4 w-10/12">
                    <Link
                      href={`/product/${product?.id}/${product?.handle}`}
                      className="flex items-center gap-2 w-full"
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
                    {product.status !== "published" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="icon"
                    onClick={() => handleDialog(index)}
                    className="z-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="4"
                      height="18"
                      viewBox="0 0 4 18"
                      fill="none"
                    >
                      <path
                        d="M2 4.75C3.1 4.75 4 3.79375 4 2.625C4 1.45625 3.1 0.5 2 0.5C0.9 0.5 0 1.45625 0 2.625C0 3.79375 0.9 4.75 2 4.75ZM2 6.875C0.9 6.875 0 7.83125 0 9C0 10.1687 0.9 11.125 2 11.125C3.1 11.125 4 10.1687 4 9C4 7.83125 3.1 6.875 2 6.875ZM2 13.25C0.9 13.25 0 14.2063 0 15.375C0 16.5438 0.9 17.5 2 17.5C3.1 17.5 4 16.5438 4 15.375C4 14.2063 3.1 13.25 2 13.25Z"
                        fill="black"
                      />
                    </svg>
                  </Button>
                  <Dialog
                    dialogRef={dialogRef}
                    isLoading={
                      isLoading.value === "product:delete" ? true : false
                    }
                    index={index}
                    id={product.id}
                    handleEditRedirect={`/material-master/edit/${product.id}`}
                    handleDelete={handleDelete}
                    isPopup={isPopup}
                  />
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

export default MaterialMaster;
