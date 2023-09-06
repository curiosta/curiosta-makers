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

type TLoadableOptions = "category:get" | "category:add";

const CategoryMaster = () => {
  const categories = useSignal<ProductCategory[]>([]);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(10);
  const offset = useSignal<number>(0);
  const isCategoryPopUp = useSignal<boolean>(false);
  const isPopUp = useSignal<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errorMessage = useSignal<string | null>(null);
  const addCategory = useSignal<ProductCategory | null>(null);

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
  }, [offset.value]);

  const handleAddCategory = async (e: ChangeEvent<HTMLFormElement>) => {
    isLoading.value = "category:add";
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

      const addCategoryRes = await adminAddCategory({
        categoryName: categoryName.toString(),
        categoryDescription: categoryDescription.toString(),
        isActive,
        isInternal,
      });
      addCategory.value = addCategoryRes?.product_category;
      isCategoryPopUp.value = false;
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

      <div className="text-center my-2 w-full mb-12">
        <div className="flex justify-end">
          <Button
            type="button"
            className="gap-2"
            onClick={() => (isCategoryPopUp.value = true)}
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
              {categories.value.map((category, index) => (
                <div className="w-full flex justify-between items-center">
                  <div className="flex justify-center items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="12"
                      viewBox="0 0 6 12"
                      fill="none"
                    >
                      <path d="M0 12L6 6L0 0L0 12Z" fill="black" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="14"
                      viewBox="0 0 16 14"
                      fill="none"
                    >
                      <path
                        d="M5.736 2.125L7.336 3.75H14.4V11.875H1.6V2.125H5.736ZM6.4 0.5H1.6C0.72 0.5 0.00799999 1.23125 0.00799999 2.125L0 11.875C0 12.7688 0.72 13.5 1.6 13.5H14.4C15.28 13.5 16 12.7688 16 11.875V3.75C16 2.85625 15.28 2.125 14.4 2.125H8L6.4 0.5Z"
                        fill="black"
                      />
                    </svg>
                    <Typography size="body1/normal">{category.name}</Typography>
                  </div>
                  <Button type="button" variant="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="4"
                      height="18"
                      viewBox="0 0 4 18"
                      fill="none"
                    >
                      <path
                        d="M2 4.75C3.1 4.75 4 3.79375 4 2.625C4 1.45625 3.1 0.5 2 0.5C0.9 0.5 0 1.45625 0 2.625C0 3.79375 0.9 4.75 2 4.75ZM2 6.875C0.9 6.875 0 7.83125 0 9C0 10.1687 0.9 11.125 2 11.125C3.1 11.125 4 10.1687 4 9C4 7.83125 3.1 6.875 2 6.875ZM2 13.25C0.9 13.25 0 14.2063 0 15.375C0 16.5438 0.9 17.5 2 17.5C3.1 17.5 4 16.5438 4 15.375C4 14.2063 3.1 13.25 2 13.25Z"
                        fill="black"
                      />
                    </svg>
                  </Button>
                </div>
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
      ) : (
        <CategoryPopup
          isPopup={isCategoryPopUp}
          handlePopupAction={handleAddCategory}
          actionText="Save"
          formRef={formRef}
          errorMessage={errorMessage}
        />
      )}

      <PopUp
        isPopup={isPopUp}
        title="Category is created successfully "
        subtitle={`Category ID: ${addCategory.value?.id} `}
      />
      <BottomNavbar />
    </div>
  );
};

export default CategoryMaster;
