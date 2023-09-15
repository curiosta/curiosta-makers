import { adminListCategory } from "@/api/admin/category/listCategory";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import NewInput from "@/components/Input/NewInput";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Select from "@/components/Select";
import Textbox from "@/components/Textbox";
import Typography from "@/components/Typography";
import { ProductCategory } from "@medusajs/medusa";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";
import { useEffect } from "preact/hooks";

type TLoadableOptions = "category:get" | "product:get" | "product:add";

const ProductAdd = () => {
  const products = useSignal<PricedProduct | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const categories = useSignal<ProductCategory[]>([]);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(0);
  const offset = useSignal<number>(0);
  const selectedCategoryIds = useSignal<string[]>([]);

  const getCategories = async () => {
    isLoading.value = "category:get";
    try {
      const categoryRes = await adminListCategory({
        limit: limit.value,
        offset: offset.value,
      });
      categories.value = categoryRes?.product_categories;
      count.value = categoryRes?.count;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    getCategories();
  }, [offset.value]);

  const handleCategory = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.currentTarget;
    if (checked) {
      console.log(value);
      selectedCategoryIds.value = [...selectedCategoryIds.value, value];
    } else {
      selectedCategoryIds.value = selectedCategoryIds.value?.filter(
        (id) => id !== value
      );
    }
  };

  console.log(selectedCategoryIds.value);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Add New Product</Typography>
      </div>

      <form className="w-full flex flex-col gap-4 mb-16" required>
        <NewInput type="text" label="Title" required />
        <NewInput
          type="text"
          label="Handle"
          pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          required
        />
        <NewInput type="text" label="Sub-title" required />
        <Textbox label="Description" required />
        <Typography size="body2/medium">Select category</Typography>
        <div className="grid grid-cols-2">
          {isLoading.value === "category:get" ? (
            <Loading loadingText="loading" />
          ) : (
            categories.value?.map((category) => (
              <Checkbox
                label={category.name}
                value={category.id}
                labelClassName="truncate w-3/4"
                onChange={handleCategory}
              />
            ))
          )}
        </div>

        <Button type="submit">Publish Product</Button>
      </form>

      <BottomNavbar />
    </div>
  );
};

export default ProductAdd;
