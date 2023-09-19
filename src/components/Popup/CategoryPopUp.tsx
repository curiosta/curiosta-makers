import { Signal, useSignal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import { ChangeEvent } from "preact/compat";
import { MutableRef, useEffect } from "preact/hooks";
import Select from "../Select";
import { adminGetCategory } from "@/api/admin/category/getCategory";
import { ProductCategory } from "@medusajs/medusa";
import NewInput from "../Input/NewInput";

type PopUp = {
  isPopup: Signal<boolean>;
  actionText: string;
  formRef: MutableRef<HTMLFormElement>;
  handlePopupAction?: (e: ChangeEvent<HTMLFormElement>) => void;
  errorMessage: Signal<string | null>;
  type: "add" | "edit";
  selectedCategoryId?: string;
};

const CategoryPopup = ({
  isPopup,
  handlePopupAction,
  formRef,
  actionText,
  errorMessage,
  selectedCategoryId,
  type,
}: PopUp) => {
  const isLoading = useSignal<boolean>(false);
  const category = useSignal<ProductCategory | null>(null);

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
      className={`fixed top-0 left-0 w-full h-full backdrop-brightness-75 items-center justify-center ${
        isPopup.value ? "flex " : "hidden"
      }`}
    >
      {/* close on outside click */}
      <div
        className="block w-full h-full"
        onClick={() => (isPopup.value = false)}
      />
      <div
        className={`absolute w-10/12 bg-secondray  rounded-2xl transition-all p-6`}
      >
        <Typography className="capitalize">
          {type === "add" ? "Add" : "Update"} Category
        </Typography>

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
            <div className="w-full flex items-center justify-between ">
              <Select
                name="status"
                options={["Active", "Inactive"]}
                label="Status"
                defaultValue={category.value?.is_active ? "Active" : "Inactive"}
              />
              <Select
                name="visibility"
                options={["Public", "Private"]}
                label="Visibility"
                defaultValue={
                  category.value?.is_internal ? "Private" : "Public"
                }
              />
            </div>
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
