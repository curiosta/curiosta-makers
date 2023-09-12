import { getProductInfo } from "@/api/product/getProductInfo";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface Props {
  id: string;
}

const ProductInfo = ({ id }: Props) => {
  const product = useSignal<PricedProduct | null>(null);
  const isLoading = useSignal<boolean>(false);

  const getProduct = async () => {
    isLoading.value = true;
    try {
      const res = await getProductInfo({ productId: id });
      product.value = res?.product;
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };
  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />

      {!isLoading.value ? (
        <div className="flex flex-col gap-4 items-center justify-center w-full mb-16 mt-4">
          <img
            src={product.value?.thumbnail ?? "/images/placeholderImg.svg"}
            alt={product.value?.title}
            className="object-cover w-10/12"
          />
          <Typography size="h6/semi-bold" className="text-center">
            {product.value?.title}
          </Typography>
          <Typography>{product.value?.description}</Typography>
        </div>
      ) : (
        <div className="h-40">
          <Loading loadingText="loading" />
        </div>
      )}

      <BottomNavbar />
    </div>
  );
};

export default ProductInfo;
