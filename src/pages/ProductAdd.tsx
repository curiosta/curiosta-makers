import UpdateInput from "@/components/Input/UpdateInput";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Textbox from "@/components/Textbox";
import Typography from "@/components/Typography";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";

type TLoadableOptions = "product:get" | "product:add";

const ProductAdd = () => {
  const products = useSignal<PricedProduct | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Add New Product</Typography>
      </div>

      <form className="w-full flex flex-col gap-4">
        <UpdateInput type="text" label="Title" />
        <UpdateInput type="text" label="Sub-title" />
        <Textbox label="Description" />
      </form>

      <BottomNavbar />
    </div>
  );
};

export default ProductAdd;
