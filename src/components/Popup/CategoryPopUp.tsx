import { Signal, useSignal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import { ChangeEvent } from "preact/compat";
import { MutableRef, useEffect } from "preact/hooks";
import Select from "../Select";
import { adminGetCategory } from "@/api/admin/category/getCategory";
import { ProductCategory } from "@medusajs/medusa";
import NewInput from "../Input/NewInput";
import { TParantCategory } from "@pages/LocationMaster";

type PopUp = {
  isPopup: Signal<boolean>;
  actionText: string;
  formRef: MutableRef<HTMLFormElement>;
  handlePopupAction?: (e: ChangeEvent<HTMLFormElement>) => void;
  errorMessage: Signal<string | null>;
  type: "add" | "edit";
  selectedCategoryId?: string;
  parentCategory?: Signal<TParantCategory>;
  variant: "location-master" | "category-master";
};

const CategoryPopup = ({
  isPopup,
  handlePopupAction,
  formRef,
  actionText,
  errorMessage,
  selectedCategoryId,
  type,
  parentCategory,
  variant,
}: PopUp) => {
  const isLoading = useSignal<boolean>(false);
  const category = useSignal<ProductCategory | null>(null);
  const copyText = useSignal<string>("copy handle");

  const getCategories = async () => {
    isLoading.value = true;
    if (!selectedCategoryId?.length) return;
    try {
      const categoryRes = await adminGetCategory({
        productCategoryId: selectedCategoryId,
      });
      category.value = categoryRes?.product_category;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    if (type === "edit") {
      getCategories();
    }
  }, [selectedCategoryId]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full backdrop-brightness-75 items-center justify-center z-10 ${
        isPopup.value ? "flex " : "hidden"
      }`}
    >
      {/* close on outside click */}
      <div
        className="block w-full h-full"
        onClick={() => (isPopup.value = false)}
      />
      <div className="absolute w-10/12 bg-secondary  rounded-2xl transition-all p-6 max-w-sm">
        {parentCategory.value && type === "add" ? (
          <div className="flex flex-col gap-2 ">
            <Typography className="capitalize">
              {type === "add" ? "Add" : "Update"} Category to{" "}
              {parentCategory.value?.name}
            </Typography>
            <Typography className="capitalize">
              {parentCategory.value?.name} /{" "}
              <span className="text-gray-400">new</span>
            </Typography>
          </div>
        ) : (
          <div>
            <Typography size="body1/semi-bold" className="capitalize">
              {type === "add" ? "Add" : "Update"} Category
            </Typography>
            {type === "edit" ? (
              <div className="flex flex-wrap gap-2 justify-between items-center my-2">
                <Typography>handle: {category.value?.handle}</Typography>
                <Button
                  variant="secondary"
                  className="rounded-2xl !px-3 !py-1 gap-2 items-center"
                  onClick={() => {
                    navigator.clipboard.writeText(category.value?.handle);
                    copyText.value = "copied";
                  }}
                >
                  {copyText.value}
                  {copyText.value === "copied" ? (
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
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : null}
                </Button>
              </div>
            ) : null}
          </div>
        )}

        <form onSubmit={handlePopupAction} ref={formRef} required>
          <div className="flex flex-col gap-4 items-center justify-center w-full my-4">
            <NewInput
              id="category_Name"
              label="Name"
              type="text"
              name="categoryName"
              placeholder="category Name"
              defaultValue={type === "edit" ? category.value?.name : ""}
              required
            />

            <NewInput
              id="category_Description"
              type="text"
              label="Description"
              name="categoryDescription"
              placeholder="category Description"
            />
            {variant === "category-master" ? (
              <div className="w-full  ">
                <Select
                  name="status"
                  options={["Active", "Inactive"]}
                  label="Status"
                  defaultValue={
                    category.value?.is_active ? "Active" : "Inactive"
                  }
                />
              </div>
            ) : null}
          </div>
          <div className="w-full flex items-center justify-evenly">
            <Button
              type="submit"
              className={`capitalize ${actionText ? "flex" : "hidden"}`}
              disabled={isLoading.value}
            >
              {isLoading.value ? "loading..." : actionText}
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={() => (isPopup.value = false)}
            >
              Close
            </Button>
          </div>
          {errorMessage.value ? (
            <Typography variant="error" className="text-center mt-2">
              {errorMessage.value}
            </Typography>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default CategoryPopup;
