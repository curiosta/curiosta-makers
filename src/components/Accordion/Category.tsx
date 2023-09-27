import Typography from "@components/Typography";
import type { ProductCategory } from "@medusajs/medusa";
import { Signal, useSignal } from "@preact/signals";
import { useRef } from "preact/compat";
import Button from "../Button";
import Dialog from "../Dialog";
import { adminDeleteCategory } from "@/api/admin/category/deleteCategory";
import { TParantCategory } from "@pages/LocationMaster";

type TLoadableOptions =
  | "category:get"
  | "category:add"
  | "category:edit"
  | "category:delete";

interface Props {
  category: ProductCategory;
  depth: number;
  index: number;
  selectedCategory: Signal<TParantCategory>;
  parentCategory: Signal<TParantCategory>;
  isCategoryEditPopUp: Signal<boolean>;
  isCategoryPopUp: Signal<boolean>;
  errorMessage: Signal<string | null>;
  getCategory: () => Promise<void>;
}

const Category = ({
  category,
  depth,
  index,
  selectedCategory,
  isCategoryEditPopUp,
  errorMessage,
  parentCategory,
  isCategoryPopUp,
  getCategory,
}: Props) => {
  const activeCategory = useSignal<string | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const dialogRef = useRef<HTMLDialogElement[]>([]);
  const isDeletePopup = useSignal<boolean>(false);

  // handle dialog
  const handleDialog = (index: number) => {
    dialogRef.current.map((val, i) => i != index && val?.close());
    if (dialogRef.current[index]?.open) {
      dialogRef.current[index]?.close();
    } else {
      dialogRef.current[index]?.show();
    }
  };

  // accordion item click
  const handleAccordion = () => {
    // don't toggle accordion state if disabled or if it does not have any children.
    if (!category.category_children.length) return;
    // toggle accordion state.
    if (activeCategory.value === category.id) {
      activeCategory.value = null;
    } else {
      activeCategory.value = category.id;
    }
  };

  const handleDelete = async (id: string, index: number) => {
    isLoading.value = "category:delete";
    try {
      await adminDeleteCategory({ productCategoryId: id });
      dialogRef.current[index]?.close();
      getCategory();
      isDeletePopup.value = false;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  const handleEdit = async (id: string, index: number) => {
    (selectedCategory.value = { id: id }),
      (isCategoryEditPopUp.value = true),
      dialogRef.current[index]?.close();
  };

  return (
    <ul className="w-full">
      <li className="w-full flex flex-col gap-2">
        <div className="w-full flex justify-between items-center relative">
          <div className="flex items-center gap-4 w-10/12">
            <div
              className="flex gap-2 items-center  w-10/12"
              style={`padding-left: ${
                category.category_children?.length
                  ? depth
                  : !category.parent_category_id
                  ? "0"
                  : depth + 2
              }rem`}
            >
              <Button
                type="button"
                variant="icon"
                className="gap-2 items-center "
                onClick={handleAccordion}
              >
                {category.category_children?.length ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="6"
                    height="12"
                    viewBox="0 0 6 12"
                    fill="none"
                    className={`${
                      activeCategory.value === category.id
                        ? "rotate-90"
                        : "rotate-0"
                    }`}
                  >
                    <path d="M0 12L6 6L0 0L0 12Z" fill="black" />
                  </svg>
                ) : null}
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
              </Button>

              <Typography size="body1/normal" className="text-start truncate ">
                {category.name}
              </Typography>
              {!category.handle.startsWith("loc:") ? (
                <div className="flex gap-2 items-center">
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
              ) : null}
            </div>
            <Button
              type="button"
              variant="icon"
              className=" bg-primary-600 rounded-full !p-1 z-[5] "
              onClick={() => {
                (isCategoryPopUp.value = true),
                  (selectedCategory.value = null),
                  (errorMessage.value = null);
                parentCategory.value = {
                  id: category?.id,
                  name: category?.name,
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
            </Button>
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
            isLoading={isLoading.value === "category:delete" ? true : false}
            index={index}
            id={category.id}
            handleDelete={
              category.category_children?.length ? undefined : handleDelete
            }
            handleEdit={handleEdit}
            isPopup={isDeletePopup}
          />
        </div>
        <div
          className={`flex-col gap-2 ${
            activeCategory.value !== category.id ? "hidden" : "flex"
          }`}
        >
          {category.category_children.length
            ? category.category_children.map((child_cate, index) => (
                <Category
                  category={child_cate}
                  depth={depth + 1}
                  index={index}
                  selectedCategory={selectedCategory}
                  isCategoryEditPopUp={isCategoryEditPopUp}
                  errorMessage={errorMessage}
                  parentCategory={parentCategory}
                  isCategoryPopUp={isCategoryPopUp}
                  getCategory={getCategory}
                />
              ))
            : ""}
        </div>
      </li>
    </ul>
  );
};

export default Category;
