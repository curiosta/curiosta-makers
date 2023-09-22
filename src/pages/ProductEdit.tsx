import { adminListCategory } from "@/api/admin/category/listCategory";
import { adminGetProduct } from "@/api/admin/product/getProduct";
import { adminUpdateProduct } from "@/api/admin/product/updateProduct";
import { adminUploadFile } from "@/api/admin/product/uploadFile";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import FileUploadPopup from "@/components/Popup/FileUploadPopup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import ProductAddEditForm from "@/components/ProductAddEditForm";
import Typography from "@/components/Typography";
import { ProductCategory } from "@medusajs/medusa";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

type Props = {
  id: string;
};

type TLoadableOptions =
  | "category:get"
  | "product:get"
  | "product:update"
  | "product:image:upload";

type TProductImages = {
  url: string;
};

const ProductEdit = ({ id }: Props) => {
  const product = useSignal<PricedProduct | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const categories = useSignal<ProductCategory[]>([]);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(0);
  const offset = useSignal<number>(0);
  const selectedCategoryIds = useSignal<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const isPopUp = useSignal<boolean>(false);
  const selectedFile = useSignal<File | null>(null);
  const uploadPopup = useSignal<boolean>(false);
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const errorMessage = useSignal<string | null>(null);
  const thumbnail = useSignal<string | null>(null);
  const productImages = useSignal<TProductImages[]>([]);
  const isImagesUpload = useSignal<boolean>(false);

  const getProduct = async () => {
    isLoading.value = "product:get";
    try {
      const productRes = await adminGetProduct({ productId: id });
      product.value = productRes?.product;
      thumbnail.value = productRes?.product?.thumbnail;
      productImages.value = productRes?.product?.images;
      const categoryIds = productRes?.product?.categories.map(
        (category) => category?.id
      );

      selectedCategoryIds.value = categoryIds;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };
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
    getProduct();
  }, [offset.value]);

  const handleUpload = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "product:image:upload";
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (
        selectedFile.value.type !== "image/png" &&
        selectedFile.value.type !== "image/jpeg"
      ) {
        return (errorMessage.value = "Only image file acceptable!");
      }
      const uploadRes = await adminUploadFile(selectedFile.value);
      if (isImagesUpload.value) {
        productImages.value = [
          ...productImages.value,
          { url: uploadRes?.uploads[0]?.url },
        ];
      } else {
        thumbnail.value = uploadRes?.uploads[0].url;
      }

      uploadPopup.value = false;
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = undefined;
      selectedFile.value = null;
    }
  };

  const handleUpdateProduct = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "product:update";
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const formDataObj = Object.fromEntries(formData.entries());
        const { title, description, status } = formDataObj;

        const categories: { id: string }[] = [];
        if (selectedCategoryIds.value?.length) {
          selectedCategoryIds.value?.map((val) => categories.push({ id: val }));
        }

        const updateProductRes = await adminUpdateProduct({
          productId: id,
          title: title.toString(),
          description: description.toString(),
          status: status.toString(),
          categories: selectedCategoryIds.value?.length ? categories : null,
          thumbnail: thumbnail.value ? thumbnail.value : null,
          images: productImages.value?.length
            ? productImages.value.map((val) => val.url)
            : null,
        });
        product.value = updateProductRes?.product;
        isPopUp.value = true;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = undefined;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Edit Product</Typography>
      </div>

      <ProductAddEditForm
        formRef={formRef}
        categories={categories}
        errorMessage={errorMessage}
        handleSubmit={handleUpdateProduct}
        isImagesUpload={isImagesUpload}
        productImages={productImages}
        isLoading={isLoading.value === "category:get" ? true : false}
        selectedCategoryIds={selectedCategoryIds}
        thumbnail={thumbnail}
        uploadPopup={uploadPopup}
        product={product}
        variant="edit"
      />
      {isLoading.value === "product:image:upload" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : (
        <FileUploadPopup
          isPopup={uploadPopup}
          selectedFile={selectedFile}
          formRef={uploadFormRef}
          actionText="Upload"
          acceptFileType="image/png, image/jpeg"
          errorMessage={errorMessage}
          handlePopupAction={handleUpload}
        />
      )}

      {isLoading.value === "product:update" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : (
        <PopUp
          isPopup={isPopUp}
          title={`Product update successfully `}
          subtitle={`Product ID: ${product.value?.id} `}
          actionLink={`/product/${product.value?.id}`}
          actionText="Check product"
        />
      )}
      <BottomNavbar />
    </div>
  );
};

export default ProductEdit;
