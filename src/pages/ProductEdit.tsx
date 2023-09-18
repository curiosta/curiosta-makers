import { adminListCategory } from "@/api/admin/category/listCategory";
import { adminGetProduct } from "@/api/admin/product/getProduct";
import { adminUpdateProduct } from "@/api/admin/product/updateProduct";
import { adminUploadFile } from "@/api/admin/product/uploadFile";
import Button from "@/components/Button";
import NewInput from "@/components/Input/NewInput";
import Loading from "@/components/Loading";
import MultiSelectCheckbox from "@/components/MultiSelectCheckbox";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import FileUploadPopup from "@/components/Popup/FileUploadPopup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Select from "@/components/Select";
import Textbox from "@/components/Textbox";
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

      <form
        className="w-full flex flex-col gap-4 mb-16"
        ref={formRef}
        onSubmit={handleUpdateProduct}
        required
      >
        <NewInput
          type="text"
          name="title"
          label="Title"
          defaultValue={product.value?.title}
          required
        />
        <Textbox
          name="description"
          defaultValue={product.value?.description}
          label="Description"
        />
        <Select
          name="status"
          defaultValue={product.value?.status}
          label="Status"
          options={["draft", "published"]}
        />
        <Typography size="body1/medium">Product images</Typography>
        <Typography size="body2/medium">Product thumbnail</Typography>
        {thumbnail.value ? (
          <div>
            <img src={thumbnail.value} alt="thumbnail" className="w-1/2" />
            <Button
              type="button"
              variant="icon"
              className="!text-danger-600  gap-2 !items-center"
              onClick={() => (thumbnail.value = null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Delete
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              uploadPopup.value = true;
              isImagesUpload.value = false;
              errorMessage.value = null;
            }}
          >
            Upload
          </Button>
        )}

        <Typography size="body2/medium">Product media</Typography>
        <div className="grid grid-cols-3 gap-2">
          {productImages.value?.length
            ? productImages.value?.map((image) => (
                <div>
                  <img src={image?.url} alt="thumbnail" />
                  <Button
                    type="button"
                    variant="icon"
                    className="!text-danger-600  gap-2 !items-center"
                    onClick={() =>
                      (productImages.value = productImages.value?.filter(
                        (val) => val.url !== image.url
                      ))
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </Button>
                </div>
              ))
            : null}
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            uploadPopup.value = true;
            isImagesUpload.value = true;
            errorMessage.value = null;
          }}
        >
          Upload
        </Button>

        <Typography size="body1/medium">Select category</Typography>

        {isLoading.value === "category:get" ? (
          <Loading loadingText="loading" />
        ) : (
          <MultiSelectCheckbox
            placeholder="Search category..."
            options={categories.value}
            selectedValues={selectedCategoryIds}
          />
        )}
        <Button type="submit" className="!w-full my-3">
          Update Product
        </Button>
        {errorMessage.value ? (
          <Typography variant="error" className="text-center mt-2">
            {errorMessage.value}
          </Typography>
        ) : null}
      </form>
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
