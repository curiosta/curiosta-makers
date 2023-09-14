import { adminGetProduct } from "@/api/admin/product/getProduct";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

type Props = {
  id: string;
};
type TLoadableOptions = "product:get" | "product:edit";

const ProductEdit = ({ id }: Props) => {
  const products = useSignal<PricedProduct | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);

  const getProduct = async () => {
    isLoading.value = "product:get";
    try {
      const productRes = await adminGetProduct({
        productId: id,
      });
      products.value = productRes?.products;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Product Edit</Typography>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default ProductEdit;
