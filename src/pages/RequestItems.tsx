import { listProducts } from "@/api/product/listProducts";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import SearchInput from "@/components/SearchInput";
import Typography from "@/components/Typography";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import OffsetPagination from "@components/OffsetPagination";
import Radio from "@/components/Radio";
import { ChangeEvent } from "preact/compat";
import ManageQty from "@/components/ManageQty";

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
  const isAddClick = useSignal<boolean>(false);
  const selectedMethod = useSignal<string>("");

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
  const handleDialog = (index: number) => {
    dialogRef.current.map((val, i) => i != index && val.close());
    if (dialogRef.current[index]?.open) {
      dialogRef.current[index]?.close();
    } else {
      dialogRef.current[index]?.show();
    }
  };

  const handleRadioInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.currentTarget;
    if (checked) {
      selectedMethod.value = value;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Request Items</Typography>
      </div>
      <SearchInput />

      <div className="text-center my-2 w-full mb-12">
        <Typography size="h6/normal" className="capitalize">
          Products
        </Typography>

        {!isLoading.value ? (
          <div>
            {products.value.map((product, index) => (
              <div
                key={product?.id}
                className="flex justify-between items-center gap-4 my-3 py-2 border-b last:border-none relative"
              >
                <div className="flex gap-2">
                  <img
                    src={product?.thumbnail || "N/A"}
                    alt="product"
                    className="w-8 h-8 object-cover"
                  />
                  <Typography size="body1/normal" className="text-start">
                    {product?.title}
                  </Typography>
                </div>
                {!dialogRef.current[index]?.open || !selectedMethod.value ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="!w-20 !border-primary-700 !text-app-primary-700 border-2 !rounded-lg uppercase"
                    onClick={() => {
                      handleDialog(index), (isAddClick.value = true);
                    }}
                  >
                    Add
                  </Button>
                ) : (
                  <ManageQty />
                )}

                {/* close on outside click */}
                <div
                  className={`w-full h-full absolute ${
                    isAddClick.value ? "z-10" : "-z-10"
                  }`}
                  onClick={() => {
                    dialogRef.current[index].close(),
                      (isAddClick.value = false);
                  }}
                />
                <dialog
                  ref={(e) => (dialogRef.current[index] = e)}
                  className="absolute translate-x-full p-2 shadow-lg rounded-md z-10"
                >
                  <Radio
                    name="add-method"
                    label="Issue"
                    value="issue"
                    // checked={radioValue.value === "issue"}
                    onChange={handleRadioInput}
                  />
                  <Radio
                    name="add-method"
                    label="Borrow"
                    value="borrow"
                    // checked={radioValue.value === "borrow"}
                    onChange={handleRadioInput}
                  />
                </dialog>
              </div>
            ))}
            <OffsetPagination limit={limit} offset={offset} count={count} />
          </div>
        ) : (
          <div className="h-40">
            <Loading />
          </div>
        )}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default RequestItems;
