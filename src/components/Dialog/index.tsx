import { MutableRef, useEffect } from "preact/hooks";
import Button from "../Button";
import { Signal, useSignal } from "@preact/signals";
import DeletePopUp from "../Popup/DeletePopUp";

type TDialog = {
  index: number;
  dialogRef: MutableRef<HTMLDialogElement[]>;
  isLoading: boolean;
  id: string;
  handleDelete?: (id: string, index: number, email?: string) => Promise<void>;
  handleEdit?: (id: string, index: number) => Promise<void>;
  handleEditRedirect?: string;
  isPopup: Signal<boolean>;
  email?: string;
  variant?: "activate-user" | "deactivate-user";
};

const Dialog = ({
  index,
  dialogRef,
  isLoading,
  id,
  handleDelete,
  handleEdit,
  handleEditRedirect,
  isPopup,
  email,
  variant,
}: TDialog) => {
  const isDeletePopup = useSignal<boolean>(false);

  return (
    <>
      {/* close on outside click */}
      <div
        className={`w-1/3 h-full absolute right-0`}
        onClick={() => {
          dialogRef.current[index]?.close();
        }}
      />
      <dialog
        ref={(e) => (dialogRef.current[index] = e)}
        className="absolute top-full left-1/2 sm:left-3/4 p-2 shadow-lg rounded-md z-10"
      >
        <div className="flex flex-col ">
          {handleEdit || handleEditRedirect ? (
            <Button
              type="button"
              link={handleEditRedirect}
              variant="icon"
              className="gap-4 !justify-start "
              onClick={() => handleEdit(id, index)}
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit
            </Button>
          ) : null}
          {handleDelete ? (
            <Button
              type="button"
              variant="icon"
              className={`gap-4 !justify-start ${
                variant === "activate-user"
                  ? "!text-green-700"
                  : "!text-danger-600"
              } `}
              onClick={() => {
                (isDeletePopup.value = true), (isPopup.value = true);
              }}
            >
              {variant === "deactivate-user" ? (
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
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              ) : variant === "activate-user" ? (
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
              ) : (
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
              )}
              {variant === "deactivate-user"
                ? "Deactivate"
                : variant === "activate-user"
                ? "Activate"
                : "Delete"}
            </Button>
          ) : null}
        </div>
      </dialog>

      {isPopup.value ? (
        <DeletePopUp
          id={id}
          index={index}
          isPopup={isDeletePopup}
          isLoading={isLoading}
          email={email}
          title={
            variant === "deactivate-user"
              ? "Are you sure you want to deactivate this user ?"
              : variant === "activate-user"
              ? "Are you sure you want to activate this user ?"
              : "Are you sure you want to delete this ?"
          }
          subtitle={
            email
              ? ""
              : "This will delete this permanently. You cannot undo this action"
          }
          handlePopupAction={handleDelete}
          actionText={"Yes, Confirm"}
        />
      ) : null}
    </>
  );
};

export default Dialog;
