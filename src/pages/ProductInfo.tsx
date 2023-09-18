import { adminGetProduct } from "@/api/admin/product/getProduct";
import { getProductInfo } from "@/api/product/getProductInfo";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import ProductImage from "@/components/ProductImage";
import Typography from "@/components/Typography";
import { isUser } from "@/store/userState";
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
      const res = isUser.value
        ? await getProductInfo({ productId: id })
        : await adminGetProduct({ productId: id });
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
        <div className="flex flex-col gap-4  justify-center w-full mb-16 mt-4">
          <ProductImage
            productImages={product.value?.images}
            prouductThumbnail={product.value?.thumbnail}
            productTitle={product.value?.title}
          />
          <Typography size="h6/semi-bold" className="text-center">
            {product.value?.title}
          </Typography>
          {!isUser.value ? (
            <>
              <Typography
                size="body1/semi-bold"
                variant="primary"
                className="text-start capitalize w-full"
              >
                Status: {product.value?.status}
              </Typography>

              <Typography
                size="body1/semi-bold"
                variant="primary"
                className="text-start w-full"
              >
                Available Stock:{" "}
                {product.value?.variants?.length
                  ? product.value?.variants?.at(0)?.inventory_quantity
                  : "N/A"}
              </Typography>
            </>
          ) : null}
          <Typography>{product.value?.description}</Typography>
          {product.value?.categories?.length ? (
            <>
              <Typography size="h6/semi-bold" className="text-start w-full">
                Category
              </Typography>
              <div className="w-full grid grid-cols-2 gap-2">
                {product.value?.categories?.map((category) => (
                  <div className="flex items-center  gap-2">
                    <span className="w-2 h-2 rounded-full bg-black"></span>{" "}
                    <Typography className="text-base capitalize truncate w-10/12">
                      {category.name}
                    </Typography>
                  </div>
                ))}
              </div>
            </>
          ) : null}
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
