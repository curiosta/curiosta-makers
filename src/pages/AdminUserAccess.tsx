import { adminCreateUser } from "@/api/admin/adminUsers/createAdminUser";
import { adminDeleteuser } from "@/api/admin/adminUsers/deleteAdminUser";
import { adminListUser } from "@/api/admin/adminUsers/listAdminUser";
import { adminUpdateUser } from "@/api/admin/adminUsers/updateAdminUser";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import UserPopUp from "@/components/Popup/UserPopUp";
import Typography from "@/components/Typography";
import { User } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

type TLoadableOptions = "user:get" | "user:add" | "user:edit" | "user:delete";
const AdminUserAccess = () => {
  const adminUsers = useSignal<User[]>([]);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const isUserPopUp = useSignal<boolean>(false);
  const isUserEditPopUp = useSignal<boolean>(false);
  const isPopUp = useSignal<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errorMessage = useSignal<string | null>(null);
  const addAdminUser = useSignal<User | null>(null);
  const dialogRef = useRef<HTMLDialogElement[]>([]);
  const selectedId = useSignal<string | undefined>(undefined);
  const isDeletePopup = useSignal<boolean>(false);

  const getUsers = async () => {
    isLoading.value = "user:get";
    try {
      const usersRes = await adminListUser();
      adminUsers.value = usersRes?.users;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    getUsers();
  }, [addAdminUser.value]);

  // handle dialog
  const handleDialog = (index: number) => {
    dialogRef.current.map((val, i) => i != index && val?.close());
    if (dialogRef.current[index]?.open) {
      dialogRef.current[index]?.close();
    } else {
      dialogRef.current[index]?.show();
    }
  };

  const handleAddUser = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "user:add";
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const formDataObj = Object.fromEntries(formData.entries());
        const { first_name, last_name, email, password } = formDataObj;

        const addAdminUserRes = await adminCreateUser({
          first_name: first_name.toString(),
          last_name: last_name.toString(),
          email: email.toString(),
          password: password.toString(),
        });
        addAdminUser.value = addAdminUserRes?.user;
        isUserPopUp.value = false;
        isPopUp.value = true;
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("422")) {
          return (errorMessage.value = "User already exists with this email");
        }
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = undefined;
    }
  };
  const handleUpdateUser = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "user:edit";
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        const formDataObj = Object.fromEntries(formData.entries());
        const { first_name, last_name } = formDataObj;
        if (!selectedId.value) return;
        const updateUserRes = await adminUpdateUser({
          customerId: selectedId.value,
          first_name: first_name.toString(),
          last_name: last_name.toString(),
        });
        addAdminUser.value = updateUserRes?.user;
        isUserEditPopUp.value = false;
        isPopUp.value = true;
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = undefined;
    }
  };

  const handleDelete = async (id: string, index: number) => {
    isLoading.value = "user:delete";
    try {
      await adminDeleteuser({ userId: id });
      dialogRef.current[index]?.close();
      getUsers();
      isDeletePopup.value = false;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  const handleEdit = async (id: string, index: number) => {
    (selectedId.value = id),
      (isUserEditPopUp.value = true),
      dialogRef.current[index]?.close();
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Admin User Access Master</Typography>
      </div>

      <div className="text-center my-2 w-full mb-20 max-w-2xl">
        <div className="flex justify-end">
          <Button
            type="button"
            className="gap-2"
            onClick={() => {
              (isUserPopUp.value = true),
                (selectedId.value = undefined),
                (errorMessage.value = null);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 stroke-secondary stroke-2"
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
        {isLoading.value !== "user:get" ? (
          <div className="w-full">
            <div className="flex flex-col  my-2 items-start gap-4">
              {adminUsers.value.map((user, index) => (
                <div className="w-full flex justify-between items-center relative">
                  <div className="flex items-center gap-4 w-10/12">
                    <Chip
                      variant="primary2"
                      className="!bg-primary-700 !rounded-full uppercase h-10 w-10 !text-white"
                    >
                      {user.first_name
                        ? user.first_name.charAt(0)
                        : user.email.charAt(0)}
                    </Chip>

                    {user?.first_name ? (
                      <Typography
                        variant="secondary"
                        className="capitalize"
                      >{`${user?.first_name} ${user?.last_name}`}</Typography>
                    ) : (
                      <Typography variant="secondary" className="capitalize">
                        {user?.email}
                      </Typography>
                    )}
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
                    isLoading={isLoading.value === "user:delete" ? true : false}
                    index={index}
                    id={user.id}
                    handleEdit={handleEdit}
                    isPopup={isDeletePopup}
                    handleDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
            <div className="w-full py-10"></div>
          </div>
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}
      </div>
      {isLoading.value === "user:add" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : isUserPopUp.value ? (
        <UserPopUp
          isPopup={isUserPopUp}
          handlePopupAction={handleAddUser}
          actionText="Save"
          type="add"
          formRef={formRef}
          errorMessage={errorMessage}
          variant="adminUser"
        />
      ) : null}

      {isLoading.value === "user:edit" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : isUserEditPopUp.value ? (
        <UserPopUp
          isPopup={isUserEditPopUp}
          handlePopupAction={handleUpdateUser}
          actionText="Update"
          type="edit"
          selectedId={selectedId.value?.length ? selectedId.value : undefined}
          formRef={formRef}
          errorMessage={errorMessage}
          variant="adminUser"
        />
      ) : null}
      <PopUp
        isPopup={isPopUp}
        title={`Admin User is ${
          selectedId.value ? "updated" : "created"
        } successfully `}
        subtitle={`User ID: ${addAdminUser.value?.id} `}
      />

      <BottomNavbar />
    </div>
  );
};

export default AdminUserAccess;
