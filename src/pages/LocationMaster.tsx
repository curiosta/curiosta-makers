import { adminAddCategory } from "@/api/admin/category/addCategory";
import { adminListCategory } from "@/api/admin/category/listCategory";
import { adminUpdateCategory } from "@/api/admin/category/updateCategory";
import Category from "@/components/Accordion/Category";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import CategoryPopup from "@/components/Popup/CategoryPopUp";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Typography from "@/components/Typography";
import { ProductCategory } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

type TLoadableOptions =
  | "locationCategory:get"
  | "locationCategory:create"
  | "category:get"
  | "category:add"
  | "category:edit"
  | "category:delete";

export type TParantCategory = {
  id: string;
  name?: string;
};

const LocationMaster = () => {
  const locationCategory = useSignal<ProductCategory | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const isCategoryPopUp = useSignal<boolean>(false);
  const isCategoryEditPopUp = useSignal<boolean>(false);
  const isPopUp = useSignal<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errorMessage = useSignal<string | null>(null);
  const addCategory = useSignal<ProductCategory | null>(null);
  const selectedCategory = useSignal<TParantCategory | null>(null);
  const parentCategory = useSignal<TParantCategory | null>(null);

  const getLocationCategory = async () => {
    isLoading.value = "locationCategory:get";
    try {
      const categoryRes = await adminListCategory({
        q: "location-master",
        limit: 0,
        offset: 0,
      });
      locationCategory.value = categoryRes?.product_categories?.at(0);
      count.value = categoryRes?.count;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    getLocationCategory();
  }, [addCategory.value]);

  // create location master
  const handleCreateLocation = async () => {
    isLoading.value = "locationCategory:create";
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      const createLocationRes = await adminAddCategory({
        categoryName: "Location-master",
        isActive: false,
        isInternal: true,
      });
      addCategory.value = createLocationRes?.product_category;
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isPopUp.value = true;
      isLoading.value = undefined;
    }
  };

  // generate random characters
  function randomChar(length: number) {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

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
        const { categoryName, categoryDescription } = formDataObj;
        const handle =
          "loc" +
          ":" +
          categoryName.toString().toLowerCase().replaceAll(" ", "-") +
          "-" +
          randomChar(5);

        const addCategoryRes = await adminAddCategory({
          categoryName: categoryName.toString(),
          categoryDescription: categoryDescription.toString(),
          isActive: false,
          isInternal: true,
          handle: handle,
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
    <div className="flex flex-col justify-center items-center p-4 w-full ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Location Master</Typography>
      </div>

      <div className="text-center my-2 w-full mb-20 sm:w-3/4">
        {locationCategory.value ? (
          <div className="flex justify-end">
            <Button
              type="button"
              className="gap-2"
              onClick={() => {
                (isCategoryPopUp.value = true),
                  (selectedCategory.value = undefined),
                  (errorMessage.value = null);
                parentCategory.value = {
                  id: locationCategory.value?.id,
                  name: locationCategory.value?.name,
                };
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
        ) : null}
        {isLoading.value !== "locationCategory:get" ? (
          <div className="w-full">
            <div className="flex flex-col  my-2 items-start gap-4">
              {locationCategory.value ? (
                locationCategory.value?.category_children?.map(
                  (category, index) => (
                    <Category
                      category={category}
                      depth={0}
                      index={index}
                      selectedCategory={selectedCategory}
                      isCategoryEditPopUp={isCategoryEditPopUp}
                      errorMessage={errorMessage}
                      parentCategory={parentCategory}
                      isCategoryPopUp={isCategoryPopUp}
                      getCategory={getLocationCategory}
                    />
                  )
                )
              ) : (
                <div className="flex flex-col gap-4 items-center w-full">
                  <Typography variant="error">
                    'Location master' Not found
                  </Typography>
                  <Button type="button" onClick={handleCreateLocation}>
                    Create 'Location master'
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}

        {errorMessage.value ? (
          <Typography variant="error" className="text-center mt-2">
            {errorMessage.value}
          </Typography>
        ) : null}
      </div>

      {isLoading.value === "locationCategory:create" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : null}

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
          variant="location-master"
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
          variant="location-master"
        />
      ) : null}
      <PopUp
        isPopup={isPopUp}
        title={`Location is ${
          selectedCategory.value ? "updated" : "created"
        } successfully `}
        subtitle={`Location ID: ${addCategory.value?.id} `}
      />

      <BottomNavbar />
    </div>
  );
};

export default LocationMaster;
