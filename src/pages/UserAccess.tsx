import { adminActivateCustomer } from "@/api/admin/customers/activateCustomer";
import { adminCreateCustomer } from "@/api/admin/customers/createCustomer";
import { adminDeactivateCustomer } from "@/api/admin/customers/deactivateCustomer";
import { adminCustomersList } from "@/api/admin/customers/listCustomers";
import { adminListDeactivateCustomers } from "@/api/admin/customers/listDeactivateCustomers";
import { adminUpdateCustomer } from "@/api/admin/customers/updateCustomer";
import user from "@/api/user";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import OffsetPagination from "@/components/OffsetPagination";
import PopUp from "@/components/Popup";
import DeletePopUp from "@/components/Popup/DeletePopUp";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import UserPopUp from "@/components/Popup/UserPopUp";
import SearchInput from "@/components/SearchInput";
import Toggle from "@/components/Toggle";
import Typography from "@/components/Typography";
import UserCard from "@/components/UserCard";
import { Customer } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { Link } from "preact-router";
import { ChangeEvent } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

type TLoadableOptions =
  | "user:get"
  | "user:add"
  | "user:edit"
  | "user:deactivate"
  | "user:activate";
const UserAccess = () => {
  const users = useSignal<Customer[]>([]);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(20);
  const offset = useSignal<number>(0);
  const isUserPopUp = useSignal<boolean>(false);
  const isUserEditPopUp = useSignal<boolean>(false);
  const isPopUp = useSignal<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errorMessage = useSignal<string | null>(null);
  const addUser = useSignal<Customer | null>(null);
  const dialogRef = useRef<HTMLDialogElement[]>([]);
  const selectedId = useSignal<string | undefined>(undefined);
  const isDeletePopup = useSignal<boolean>(false);
  const searchTerm = useSignal<string | undefined>(undefined);
  const activeToggle = useSignal<"active" | "inactive">("active");
  const selectedUser = useSignal<Customer | null>(null);

  const getUsers = async () => {
    isLoading.value = "user:get";
    try {
      if (activeToggle.value === "active") {
        const usersRes = await adminCustomersList({
          q: searchTerm.value ? searchTerm.value : undefined,
          has_account: true,
          limit: limit.value,
          offset: offset.value,
        });
        if (!usersRes?.customers?.length && usersRes?.count) {
          offset.value = 0;
        }
        users.value = usersRes?.customers;
        count.value = usersRes?.count;
      } else {
        searchTerm.value = undefined;
        const usersRes = await adminListDeactivateCustomers();
        users.value = usersRes;
        count.value = usersRes?.length;
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    if (searchTerm.value) {
      const getData = setTimeout(() => {
        getUsers();
      }, 500);
      return () => clearTimeout(getData);
    }
    getUsers();
  }, [offset.value, searchTerm.value, addUser.value, activeToggle.value]);

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

        const addUserRes = await adminCreateCustomer({
          first_name: first_name.toString(),
          last_name: last_name.toString(),
          email: email.toString(),
          password: password.toString(),
        });
        addUser.value = addUserRes?.customer;
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
        const { first_name, last_name, phone, dob, gender } = formDataObj;
        if (!selectedId.value) return;
        const addUserRes = await adminUpdateCustomer({
          customerId: selectedId.value,
          first_name: first_name.toString(),
          last_name: last_name.toString(),
          phone: phone.toString(),
          metadata: {
            gender: gender.toString(),
            dob: new Date(dob.toString()),
          },
        });
        addUser.value = addUserRes?.customer;
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

  const handleActivate = async (id: string, index: number, email: string) => {
    isLoading.value = "user:activate";
    try {
      await adminActivateCustomer({ email });
      dialogRef.current[index]?.close();
      getUsers();
      isDeletePopup.value = false;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };
  const handleDeactivate = async (id: string, index: number, email: string) => {
    isLoading.value = "user:deactivate";
    try {
      await adminDeactivateCustomer({ email });
      dialogRef.current[index]?.close();
      getUsers();
      isDeletePopup.value = false;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  const handleEdit = (id: string) => {
    selectedId.value = id;
    isUserEditPopUp.value = true;
  };
  const handleActiveInactive = (user: Customer) => {
    isDeletePopup.value = true;
    selectedUser.value = user;
  };
  return (
    <div className="flex flex-col justify-center items-center p-4 w-full ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">User Access Master</Typography>
      </div>
      <div className="w-full mb-12 max-w-2xl">
        <Toggle
          activeToggle={activeToggle}
          toggleItems={["active", "inactive"]}
          isLoading={isLoading.value === "user:get" ? true : false}
          count={count.value}
        />
        {activeToggle.value === "active" ? (
          <SearchInput
            searchTerm={searchTerm}
            placeholder="Search active users"
            isSearchSort={false}
          />
        ) : null}
        <div className="text-center my-2 w-full mb-20">
          {activeToggle.value === "active" ? (
            <div className="flex justify-end">
              <Button className="gap-2" link="/add-user">
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
          {isLoading.value !== "user:get" ? (
            users.value?.length ? (
              <div
                className={`w-full flex flex-col  my-4 gap-4 ${
                  count.value < limit.value ? "mb-20" : ""
                }`}
              >
                {users.value.map((user, index) => (
                  <UserCard
                    user={user}
                    activeToggle={activeToggle.value}
                    handleEdit={handleEdit}
                    handleActiveInactive={handleActiveInactive}
                  />
                ))}
                <OffsetPagination limit={limit} offset={offset} count={count} />
              </div>
            ) : !users.value?.length && count.value ? (
              <div className="w-full h-40 ">
                <Loading loadingText="loading" />
              </div>
            ) : (
              <Typography className="w-full">User not found</Typography>
            )
          ) : (
            <div className="h-40">
              <Loading loadingText="loading" />
            </div>
          )}
        </div>

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
            variant="user"
          />
        ) : null}

        <DeletePopUp
          id={selectedUser.value?.id}
          index={0}
          isPopup={isDeletePopup}
          isLoading={
            activeToggle.value === "active"
              ? isLoading.value === "user:deactivate"
                ? true
                : false
              : isLoading.value === "user:activate"
              ? true
              : false
          }
          email={selectedUser.value?.email}
          title={
            activeToggle.value === "active"
              ? `Are you sure you want to deactivate ${selectedUser.value?.email} ?`
              : `Are you sure you want to activate ${selectedUser.value?.email} ?`
          }
          subtitle={
            activeToggle.value === "active"
              ? "This will deactivate this user. You can activate later from inactive user list"
              : "This will activate this user. You can deactivate later from active user list"
          }
          handlePopupAction={
            activeToggle.value === "active" ? handleDeactivate : handleActivate
          }
          actionText={"Yes, Confirm"}
        />

        <PopUp
          isPopup={isPopUp}
          title={`User is ${
            selectedId.value ? "updated" : "created"
          } successfully `}
          subtitle={`User ID: ${addUser.value?.id} `}
        />

        <BottomNavbar />
      </div>
    </div>
  );
};

export default UserAccess;
