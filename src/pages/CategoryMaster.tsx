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
import { adminDeleteCategory } from "@/api/admin/category/deleteCategory";
import Dialog from "@/components/Dialog";

type TLoadableOptions =
  | "category:get"
  | "category:add"
  | "category:edit"
  | "category:delete";

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
  const dialogRef = useRef<HTMLDialogElement[]>([]);
  const selectedCategoryId = useSignal<string | undefined>(undefined);

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
  }, [offset.value, addCategory.value]);

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
        const {
          categoryName,
          categoryHanlde,
          categoryDescription,
          status,
          visibility,
        } = formDataObj;

        const isActive = status === "active" ? true : false;
        const isInternal = visibility === "private" ? true : false;
        const addCategoryRes = await adminAddCategory({
          categoryName: categoryName.toString(),
          handle: categoryHanlde.toString(),
          categoryDescription: categoryDescription.toString(),
          isActive,
          isInternal,
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

  // handle dialog
  const handleDialog = (index: number) => {
    dialogRef.current.map((val, i) => i != index && val?.close());
    if (dialogRef.current[index]?.open) {
      dialogRef.current[index]?.close();
    } else {
      dialogRef.current[index]?.show();
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
    const {
      categoryName,
      categoryHanlde,
      categoryDescription,
      status,
      visibility,
    } = formDataObj;

    try {
      const isActive = status === "active" ? true : false;
      const isInternal = visibility === "private" ? true : false;
      if (!selectedCategoryId.value) return;
      const updateCategoryRes = await adminUpdateCategory({
        productCategoryId: selectedCategoryId.value,
        categoryName: categoryName.toString(),
        handle: categoryHanlde.toString(),
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

  const handleDelete = async (id: string, index: number) => {
    isLoading.value = "category:delete";
    try {
      await adminDeleteCategory({ productCategoryId: id });
      dialogRef.current[index]?.close();
      getCategories();
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  const handleEdit = async (id: string, index: number) => {
    (selectedCategoryId.value = id),
      (isCategoryEditPopUp.value = true),
      dialogRef.current[index]?.close();
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Category Master</Typography>
      </div>

      <div className="text-center my-2 w-full mb-20">
        <div className="flex justify-end">
          <Button
            type="button"
            className="gap-2"
            onClick={() => {
              (isCategoryPopUp.value = true),
                (selectedCategoryId.value = undefined),
                (errorMessage.value = null);
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
              {categories.value.map((category, index) => (
                <div className="w-full flex justify-between items-center relative">
                  <div className="flex items-center gap-4 w-10/12">
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
                    <Typography
                      size="body1/normal"
                      className="text-start truncate w-2/3"
                    >
                      {category.name}
                    </Typography>
                    {!category.is_active ? (
                      <span className="w-3 h-3 bg-danger-600 rounded-full"></span>
                    ) : null}
                    {category.is_internal ? (
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
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="icon"
                    onClick={() => handleDialog(index)}
                    className="z-10"
                  >
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
                  <Dialog
                    dialogRef={dialogRef}
                    isLoading={
                      isLoading.value === "category:delete" ? true : false
                    }
                    index={index}
                    id={category.id}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                  />
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
      ) : isCategoryPopUp.value ? (
        <CategoryPopup
          isPopup={isCategoryPopUp}
          handlePopupAction={handleAddCategory}
          actionText="Save"
          type="add"
          formRef={formRef}
          errorMessage={errorMessage}
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
            selectedCategoryId.value?.length
              ? selectedCategoryId.value
              : undefined
          }
          formRef={formRef}
          errorMessage={errorMessage}
        />
      ) : null}
      <PopUp
        isPopup={isPopUp}
        title={`Category is ${
          selectedCategoryId.value ? "updated" : "created"
        } successfully `}
        subtitle={`Category ID: ${addCategory.value?.id} `}
      />
      <BottomNavbar />
    </div>
  );
};

export default CategoryMaster;
