import { adminListCategory } from "@/api/admin/category/listCategory";
import { adminAddProduct } from "@/api/admin/product/addProduct";
import { adminUploadFile } from "@/api/admin/upload/uploadFile";
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

type TLoadableOptions =
  | "category:get"
  | "product:add"
  | "product:image:upload"
  | "locationCategory:get";

export type TProductImages = {
  url: string;
};

const ProductAdd = () => {
  const product = useSignal<PricedProduct | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const categories = useSignal<ProductCategory[]>([]);
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
  const locationCategory = useSignal<ProductCategory[]>([]);
  const flattenLocations = useSignal<ProductCategory[]>([]);

  const getCategories = async () => {
    isLoading.value = "category:get";
    try {
      const categoryRes = await adminListCategory({
        limit: 0,
        offset: 0,
      });
      categories.value = categoryRes?.product_categories;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  const getLocationCategory = async () => {
    isLoading.value = "locationCategory:get";
    try {
      const categoryRes = await adminListCategory({
        q: "location-master",
        limit: 0,
        offset: 0,
      });
      locationCategory.value =
        categoryRes?.product_categories?.at(0)?.category_children;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  const flatten = (routes: ProductCategory[]) => {
    routes.map((r) => {
      if (r.category_children && r.category_children.length) {
        flatten(r.category_children);
        return (flattenLocations.value = [...flattenLocations.value, r]);
      }
    });
  };

  useEffect(() => {
    if (flattenLocations.value?.length) {
      flattenLocations.value = [];
    }
    flatten(locationCategory.value);
  }, [locationCategory.value]);

  useEffect(() => {
    getCategories();
    getLocationCategory();
  }, []);

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

  const handleAddProduct = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "product:add";
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const formDataObj = Object.fromEntries(formData.entries());
        const { title, description, status, location } = formDataObj;

        const categories: { id: string }[] = [{ id: location.toString() }];

        let parentLocations: ProductCategory[] = [];

        const getParentLocations = (categoryId: string) => {
          flattenLocations.value?.map((cate) => {
            if (cate.category_children.some((cate) => cate.id === categoryId)) {
              getParentLocations(cate.id);
              return (parentLocations = [...parentLocations, cate]);
            }
          });
        };
        getParentLocations(location.toString());

        if (parentLocations?.length) {
          parentLocations?.map((cate) => categories.push({ id: cate.id }));
        }

        if (selectedCategoryIds.value?.length) {
          selectedCategoryIds.value?.map((val) => categories.push({ id: val }));
        }

        const updateProductRes = await adminAddProduct({
          title: title.toString(),
          description: description.toString(),
          status: status.toString(),
          categories:
            selectedCategoryIds.value?.length || parentLocations?.length
              ? categories
              : null,
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
        if (error.message.includes("422")) {
          return (errorMessage.value =
            "Product already exists with this title");
        }
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
        <Typography size="h6/normal">Add Product</Typography>
      </div>
      <ProductAddEditForm
        formRef={formRef}
        categories={categories}
        errorMessage={errorMessage}
        handleSubmit={handleAddProduct}
        isImagesUpload={isImagesUpload}
        productImages={productImages}
        isLoading={isLoading.value === "category:get" ? true : false}
        selectedCategoryIds={selectedCategoryIds}
        thumbnail={thumbnail}
        uploadPopup={uploadPopup}
        product={product}
        variant="add"
        locationCategory={locationCategory}
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

      {isLoading.value === "product:add" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : (
        <PopUp
          isPopup={isPopUp}
          title={`Product added successfully `}
          subtitle={`Product ID: ${product.value?.id} `}
          actionLink={`/product/${product.value?.id}`}
          actionText="Check product"
        />
      )}
      <BottomNavbar />
    </div>
  );
};

export default ProductAdd;
