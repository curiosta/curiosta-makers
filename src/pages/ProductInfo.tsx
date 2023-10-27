import { adminGetProduct } from "@/api/admin/product/getProduct";
import cart from "@/api/cart";
import { getProductInfo } from "@/api/product/getProductInfo";
import user from "@/api/user";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ManageQty from "@/components/ManageQty";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import ProductImage from "@/components/ProductImage";
import Radio from "@/components/Radio";
import Typography from "@/components/Typography";
import ViewCartLayer from "@/components/ViewCartLayer";
import { isUser } from "@/store/userState";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

interface Props {
  id: string;
  handle?: string;
}

const ProductInfo = ({ id }: Props) => {
  const product = useSignal<PricedProduct | null>(null);
  const isLoading = useSignal<boolean>(false);
  const cartTypeOpen = useSignal<boolean>(false);
  const selectedCartType = useSignal<string | null>(null);
  const isProfileCompletePopUp = useSignal<boolean>(false);
  const isProfileImgIdCardPopUp = useSignal<boolean>(false);

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

  const handleAddToCart = () => {
    const { shipping_addresses, phone } = user.customer.value;
    const { profile_image_key, govt_id_key } = user.customer.value?.metadata;
    const isProfileComplete = shipping_addresses?.length > 0 && phone !== null;

    if (!profile_image_key || !govt_id_key) {
      return (isProfileImgIdCardPopUp.value = true);
    }
    if (!isProfileComplete) {
      return (isProfileCompletePopUp.value = true);
    }

    cartTypeOpen.value = !cartTypeOpen.value;
  };

  // handle radio input and add line items with selected cart type value
  const handleRadioInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.currentTarget;
    if (checked) {
      selectedCartType.value = value;
    }
    if (selectedCartType.value) {
      try {
        await cart.addItem({
          id: product.value?.variants?.[0]?.id,
          metadata: { cartType: selectedCartType.value },
        });
      } catch (error) {
        console.log(error);
      } finally {
        cartTypeOpen.value = false;
      }
    }
  };

  const isProductItemInCart = cart.store.value?.items?.find(
    (item) => item?.variant.product_id === product.value?.id
  );

  const categories = product.value?.categories?.filter(
    (cate) => !cate.handle.startsWith("loc:")
  );
  const locations = product.value?.categories
    ?.filter((cate) => cate.handle.startsWith("loc:"))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full ">
      <TopNavbar />
      <div className="w-full mb-12 max-w-2xl">
        {!isLoading.value ? (
          <div className="flex flex-col gap-4  justify-center w-full mb-28 mt-4">
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
              <div className="flex flex-col gap-3">
                <Typography size="h6/semi-bold" className="text-start w-full">
                  Category
                </Typography>
                <ul className="w-full grid grid-cols-2 gap-2 ml-4">
                  {categories?.length ? (
                    categories?.map((category) => (
                      <li className="list-disc">
                        <Typography className="text-base capitalize truncate w-10/12">
                          {category.name}
                        </Typography>
                      </li>
                    ))
                  ) : (
                    <Typography size="body2/normal" variant="error">
                      category not found
                    </Typography>
                  )}
                </ul>
                <Typography size="h6/semi-bold" className="text-start w-full">
                  Location
                </Typography>
                <ul className="w-full ml-4">
                  {locations?.length ? (
                    locations?.map((category) => (
                      <li className="list-disc">
                        <Typography className="text-base capitalize ">
                          {category.name}
                        </Typography>
                      </li>
                    ))
                  ) : (
                    <Typography size="body2/normal" variant="error">
                      location not found
                    </Typography>
                  )}
                </ul>
              </div>
            ) : null}

            {isUser.value ? (
              <div className="w-full mb-12  relative border-t-2">
                <div
                  className={`absolute top-16 w-full p-2 shadow-lg rounded-md z-10 transition-all bg-secondray
              ${
                cartTypeOpen.value
                  ? "translate-x-0 left-0"
                  : "-translate-x-full -left-full"
              }`}
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
                    <div className="flex justify-evenly items-center">
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
                    </div>
                  )}
                </div>
                {cart.loading.value === "cart:get" ? (
                  <div className="pt-4">
                    <Loading loadingText="loading" />
                  </div>
                ) : !isProductItemInCart ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="!w-full border-2 !rounded-lg mt-4"
                    onClick={handleAddToCart}
                  >
                    Add to cart
                  </Button>
                ) : (
                  <div className="flex justify-between mt-4">
                    <Typography size="body1/semi-bold">
                      Added to cart
                    </Typography>
                    <ManageQty
                      productItem={isProductItemInCart}
                      page="request"
                    />
                  </div>
                )}
                <ViewCartLayer actionText="View Cart" actionLink="/cart" />
              </div>
            ) : null}

            {!isUser.value ? (
              <Button
                type="button"
                variant="icon"
                title="Edit"
                link={`/material-master/edit/${id}`}
                className="z-10 text-third-500 !rounded-full border-2 gap-2 sm:px-4 !shadow-sm sm:w-fit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6"
                >
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                </svg>
                Edit Product
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}

        <PopUp
          isPopup={isProfileCompletePopUp}
          actionText="Check profile"
          actionLink={`/user/${user.customer.value?.id}`}
          title="Please complete your profile first!"
          subtitle="Add your phone no. and address before request any item"
        />
        <PopUp
          isPopup={isProfileImgIdCardPopUp}
          title="Profile image or ID Card not found!"
          subtitle="Contact the admin for adding a profile image and government ID card."
        />
        <BottomNavbar />
      </div>
    </div>
  );
};

export default ProductInfo;
