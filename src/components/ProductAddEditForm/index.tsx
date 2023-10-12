import { MutableRef, useEffect } from "preact/hooks";
import Button from "@components/Button";
import NewInput from "@components/Input/NewInput";
import Loading from "@components/Loading";
import MultiSelectCheckbox from "@components/MultiSelectCheckbox";
import Select from "@components/Select";
import Textbox from "@components/Textbox";
import Typography from "@components/Typography";
import { ChangeEvent } from "preact/compat";
import { Signal, useSignal } from "@preact/signals";
import { TProductImages } from "@pages/ProductAdd";
import { ProductCategory } from "@medusajs/medusa";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";

type TProductAddEditForm = {
  formRef: MutableRef<HTMLFormElement>;
  handleSubmit: (e: ChangeEvent<HTMLFormElement>) => Promise<void | string>;
  thumbnail: Signal<string | null>;
  uploadPopup: Signal<boolean>;
  isImagesUpload: Signal<boolean>;
  errorMessage: Signal<string | null>;
  productImages: Signal<TProductImages[]>;
  categories: Signal<ProductCategory[]>;
  selectedCategoryIds: Signal<string[]>;
  isLoading: boolean;
  product: Signal<PricedProduct | null>;
  variant: "add" | "edit";
  locationCategory: Signal<ProductCategory[]>;
};

const ProductAddEditForm = ({
  formRef,
  handleSubmit,
  thumbnail,
  uploadPopup,
  errorMessage,
  isImagesUpload,
  productImages,
  categories,
  selectedCategoryIds,
  isLoading,
  product,
  variant,
  locationCategory,
}: TProductAddEditForm) => {
  const binLocations = useSignal<ProductCategory[]>([]);

  const getLowesetLocation = (category: ProductCategory[]) => {
    category.map((cate) => {
      if (!cate.category_children.length) {
        return (binLocations.value = [...binLocations.value, cate]);
      } else {
        getLowesetLocation(cate.category_children);
      }
    });
  };

  useEffect(() => {
    if (binLocations.value?.length) {
      binLocations.value = [];
    }
    getLowesetLocation(locationCategory.value);
  }, [locationCategory.value]);

  const categoriesWithoutLocations = categories.value?.filter(
    (category) =>
      category.handle !== "location-master" &&
      !category.handle.startsWith("loc:")
  );

  return (
    <form
      className="w-full flex flex-col gap-4 mb-16"
      ref={formRef}
      onSubmit={handleSubmit}
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
      <Select
        name="location"
        defaultValue={
          product.value?.categories?.find((cate) =>
            cate.handle.startsWith("loc:bin")
          )?.id
        }
        label="Location"
        options={binLocations.value?.map((bin) => ({
          label: bin.name,
          value: bin.id,
        }))}
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

      <NewInput
        type="number"
        name="quantity"
        label="Inventory quantity"
        value={product.value?.variants[0]?.inventory_quantity}
        required
      />

      <Typography size="body1/medium">Select category</Typography>

      {isLoading ? (
        <Loading loadingText="loading" />
      ) : (
        <MultiSelectCheckbox
          placeholder="Search category..."
          options={categoriesWithoutLocations}
          selectedValues={selectedCategoryIds}
        />
      )}

      {errorMessage.value ? (
        <Typography variant="error" className="text-center mt-2">
          {errorMessage.value}
        </Typography>
      ) : null}
      <Button type="submit" className="!w-full my-2">
        {variant === "add" ? "Add" : "Update"} Product
      </Button>
    </form>
  );
};

export default ProductAddEditForm;
