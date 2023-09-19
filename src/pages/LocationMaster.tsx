import { adminListCategory } from "@/api/admin/category/listCategory";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import { ProductCategory } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

type TLoadableOptions =
  | "category:get"
  | "category:add"
  | "category:edit"
  | "category:delete";

const LocationMaster = () => {
  const category = useSignal<ProductCategory | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(20);
  const offset = useSignal<number>(0);

  const getCategories = async () => {
    isLoading.value = "category:get";
    try {
      const categoryRes = await adminListCategory({
        q: "location",
        limit: limit.value,
        offset: offset.value,
      });
      category.value = categoryRes?.product_categories?.at(0);
      count.value = categoryRes?.count;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    getCategories();
  }, [offset.value]);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Location Master</Typography>
      </div>

      <Typography>{category.value?.name}</Typography>

      <BottomNavbar />
    </div>
  );
};

export default LocationMaster;
