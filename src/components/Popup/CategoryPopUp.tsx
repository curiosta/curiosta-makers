import { Signal, useSignal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import Input from "../Input";
import { ChangeEvent } from "preact/compat";
import { MutableRef, useEffect } from "preact/hooks";
import Select from "../Select";
import FormControl from "../FormControl";
import { adminGetCategory } from "@/api/admin/category/getCategory";
import { ProductCategory } from "@medusajs/medusa";

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
            <div className="w-full">
              <label
                htmlFor="category_Name"
                className="text-sm font-medium leading-6 text-gray-900 flex gap-1 mb-1"
              >
                Name
              </label>
              <input
                id="category_Name"
                type="text"
                className="block w-full rounded-md border-0 p-1.5 px-3 text-gray-900 shadow-sm
                ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                focus:ring-inset focus:ring-primary-600  sm:text-sm sm:leading-6 focus-visible:outline-none"
                name="categoryName"
                placeholder="category Name"
                defaultValue={type === "edit" ? category.value?.name : ""}
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="category_Handle"
                className="text-sm font-medium leading-6 text-gray-900 flex gap-1 mb-1"
              >
                Handle
              </label>
              <input
                id="category_Handle"
                type="text"
                className="block w-full rounded-md border-0 p-1.5 px-3 text-gray-900 shadow-sm
                ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                focus:ring-inset focus:ring-primary-600  sm:text-sm sm:leading-6 focus-visible:outline-none"
                name="categoryHanlde"
                placeholder="category Hanlde"
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                required
                defaultValue={type === "edit" ? category.value?.handle : ""}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="category_Description"
                className="text-sm font-medium leading-6 text-gray-900 flex gap-1 mb-1"
              >
                Description
              </label>
              <input
                id="category_Description"
                type="text"
                className="block w-full rounded-md border-0 p-1.5 px-3 text-gray-900 shadow-sm
                ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2
                focus:ring-inset focus:ring-primary-600  sm:text-sm sm:leading-6 focus-visible:outline-none"
                name="categoryDescription"
                placeholder="category Description"
              />
            </div>
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
