import { adminListCategory } from "@/api/admin/category/listCategory";
import Button from "@/components/Button";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import { ProductCategory } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import OffsetPagination from "@components/OffsetPagination";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import CategoryPopup from "@/components/Popup/CategoryPopUp";
import { ChangeEvent } from "preact/compat";
import { adminAddCategory } from "@/api/admin/category/addCategory";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import PopUp from "@/components/Popup";
import { adminUpdateCategory } from "@/api/admin/category/updateCategory";
import Category from "@/components/Accordion/Category";
import SearchInput, { TSortOptions } from "@/components/SearchInput";

type TLoadableOptions =
  | "category:get"
  | "category:add"
  | "category:edit"
  | "category:delete";

type TParantCategory = {
  id: string;
  name?: string;
};
const CategoryMaster = () => {
  const categories = useSignal<ProductCategory[]>([]);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(20);
  const offset = useSignal<number>(0);
  const isCategoryPopUp = useSignal<boolean>(false);
  const isCategoryEditPopUp = useSignal<boolean>(false);
  const isPopUp = useSignal<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errorMessage = useSignal<string | null>(null);
  const addCategory = useSignal<ProductCategory | null>(null);
  const selectedCategory = useSignal<TParantCategory | null>(null);
  const parentCategory = useSignal<TParantCategory | null>(null);
  const dialogRef = useRef<HTMLDialogElement[]>([]);
  const selectedCategoryId = useSignal<string | undefined>(undefined);
  const isDeletePopup = useSignal<boolean>(false);
  const searchTerm = useSignal<string | undefined>(undefined);

  const getCategories = async () => {
    isLoading.value = "category:get";
    try {
      const categoryRes = await adminListCategory({
        q: searchTerm.value ? searchTerm.value : undefined,
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
    if (searchTerm.value) {
      const getData = setTimeout(() => {
        getCategories();
      }, 500);
      return () => clearTimeout(getData);
    }
    getCategories();
  }, [offset.value, searchTerm.value, addCategory.value]);

  const topParanetCategory = categories.value?.filter(
    (category) => category.parent_category_id === null
  );

  const handleAddCategory = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "category:add";

    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const formDataObj = Object.fromEntries(formData.entries());
        const { categoryName, categoryDescription, status, visibility } =
          formDataObj;

        const isActive = status === "active" ? true : false;
        const isInternal = visibility === "private" ? true : false;
        const addCategoryRes = await adminAddCategory({
          categoryName: categoryName.toString(),
          categoryDescription: categoryDescription.toString(),
          isActive,
          isInternal,
          parentCategoryId: parentCategory.value
            ? parentCategory.value?.id
            : null,
        });
        addCategory.value = addCategoryRes?.product_category;
        isCategoryPopUp.value = false;
        isPopUp.value = true;
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("422")) {
          return (errorMessage.value =
            "Product_category with this handle already exists");
        }
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = undefined;
    }
  };

  const handleUpdateCategory = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "category:edit";
    if (!formRef.current) return;
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    const formData = new FormData(formRef.current);
    const formDataObj = Object.fromEntries(formData.entries());
    const { categoryName, categoryDescription, status, visibility } =
      formDataObj;

    try {
      const isActive = status === "active" ? true : false;
      const isInternal = visibility === "private" ? true : false;
      if (!selectedCategory.value) return;
      const updateCategoryRes = await adminUpdateCategory({
        productCategoryId: selectedCategory.value?.id,
        categoryName: categoryName.toString(),
        categoryDescription: categoryDescription.toString(),
        isActive,
        isInternal,
      });
      addCategory.value = updateCategoryRes?.product_category;
      isCategoryEditPopUp.value = false;
      isPopUp.value = true;
    } catch (error) {
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
        <Typography size="h6/normal">Category Master</Typography>
      </div>
      <SearchInput searchTerm={searchTerm} isSearchSort={false} />
      <div className="text-center my-2 w-full mb-20">
        <div className="flex justify-end">
          <Button
            type="button"
            className="gap-2"
            onClick={() => {
              (isCategoryPopUp.value = true),
                (selectedCategory.value = undefined),
                (parentCategory.value = undefined);
              errorMessage.value = null;
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 stroke-secondray stroke-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add
          </Button>
        </div>
        {isLoading.value !== "category:get" ? (
          <div className="w-full">
            <div className="flex flex-col  my-2 items-start gap-4">
              {topParanetCategory?.map((category, index) => (
                <Category
                  category={category}
                  depth={0}
                  index={index}
                  selectedCategory={selectedCategory}
                  isCategoryEditPopUp={isCategoryEditPopUp}
                  errorMessage={errorMessage}
                  parentCategory={parentCategory}
                  isCategoryPopUp={isCategoryPopUp}
                  getCategory={getCategories}
                />
              ))}
            </div>
            <OffsetPagination limit={limit} offset={offset} count={count} />
          </div>
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}
      </div>

      {isLoading.value === "category:add" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : isCategoryPopUp.value ? (
        <CategoryPopup
          isPopup={isCategoryPopUp}
          handlePopupAction={handleAddCategory}
          actionText="Save"
          type="add"
          formRef={formRef}
          errorMessage={errorMessage}
          parentCategory={parentCategory}
          variant="category-master"
        />
      ) : null}
      {isLoading.value === "category:edit" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : isCategoryEditPopUp.value ? (
        <CategoryPopup
          isPopup={isCategoryEditPopUp}
          handlePopupAction={handleUpdateCategory}
          actionText="Update"
          type="edit"
          selectedCategoryId={
            selectedCategory.value ? selectedCategory.value?.id : undefined
          }
          formRef={formRef}
          errorMessage={errorMessage}
          parentCategory={parentCategory}
          variant="category-master"
        />
      ) : null}
      <PopUp
        isPopup={isPopUp}
        title={`Category is ${
          selectedCategory.value ? "updated" : "created"
        } successfully `}
        subtitle={`Category ID: ${addCategory.value?.id} `}
      />
      <BottomNavbar />
    </div>
  );
};

export default CategoryMaster;
