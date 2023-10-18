import { adminGetCustomer } from "@/api/admin/customers/getCustomer";
import { adminUpdateCustomer } from "@/api/admin/customers/updateCustomer";
import { adminOrdersList } from "@/api/admin/orders/ordersList";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import OffsetPagination from "@/components/OffsetPagination";
import OrderItem from "@/components/Orders/OrderItem";
import OrderStatusToggle from "@/components/Orders/OrderStatusToggle";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import UserPopUp from "@/components/Popup/UserPopUp";
import Typography from "@/components/Typography";
import { isUser } from "@/store/userState";
import { Address, Customer, Order } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import user, { TCustomer } from "@api/user";
import AddressList from "@/components/AddressList";
import ProfileImageEdit from "@/components/ProfileImageEdit";
import { adminGetProtectedUploadFile } from "@/api/admin/upload/getProtectedUpload";
import FileUploadPopup from "@/components/Popup/FileUploadPopup";
import { adminProtectedUploadFile } from "@/api/admin/upload/protectedUploadFile";
import { adminDeleteUploadFile } from "@/api/admin/upload/deleteUpload";
import DeletePopUp from "@/components/Popup/DeletePopUp";

type Props = {
  id: string;
};
type TLoadableOptions =
  | "user:get"
  | "user:edit"
  | "user:oders:get"
  | "profile:govtId:upload"
  | "profile:govtId:delete";

const UserProfile = ({ id }: Props) => {
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const userData = useSignal<Customer | TCustomer | null>(null);
  const dialogRef = useRef<HTMLDialogElement[]>([]);
  const isUserEditPopUp = useSignal<boolean>(false);
  const isPopUp = useSignal<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errorMessage = useSignal<string | null>(null);
  const isDeletePopup = useSignal<boolean>(false);
  const orders = useSignal<Order[]>([]);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(10);
  const offset = useSignal<number>(0);
  const activeToggle = useSignal<string[]>(["awaiting"]);
  const address = useSignal<Address[]>([]);
  const isProfileImageEdit = useSignal<boolean>(false);
  const profileImageKey = useSignal<string | undefined>(undefined);
  const profileImageUrl = useSignal<string | undefined>(undefined);
  const profileIdCardKey = useSignal<string | undefined>(undefined);
  const profileIdCardUrl = useSignal<string | undefined>(undefined);
  const selectedFile = useSignal<File | null>(null);
  const uploadPopup = useSignal<boolean>(false);
  const uploadFormRef = useRef<HTMLFormElement>(null);

  const getUser = async () => {
    isLoading.value = "user:get";
    try {
      if (isUser.value) {
        userData.value = user.customer.value;
      } else {
        const userRes = await adminGetCustomer({
          customerId: id,
        });
        userData.value = userRes?.customer;
        const { profile_image_key, govt_id_key } = (
          userRes?.customer as TCustomer
        )?.metadata;
        if (profile_image_key) {
          profileImageKey.value = profile_image_key;
          const profileImageUploadRes = await adminGetProtectedUploadFile({
            file_key: profile_image_key,
          });
          profileImageUrl.value = profileImageUploadRes?.download_url;
        }
        if (govt_id_key) {
          profileIdCardKey.value = govt_id_key;
          const govtIdUploadRes = await adminGetProtectedUploadFile({
            file_key: govt_id_key,
          });
          profileIdCardUrl.value = govtIdUploadRes?.download_url;
        }
      }
      address.value = userData.value?.shipping_addresses;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = undefined;
    }
  };

  const getOrdersList = async () => {
    isLoading.value = "user:oders:get";
    try {
      const res = await adminOrdersList({
        customer_id: id,
        payment_status: activeToggle.value.some((active) =>
          ["awaiting", "captured"].includes(active)
        )
          ? activeToggle.value
          : [],
        fulfillment_status: activeToggle.value.some((active) =>
          [
            "fulfilled",
            "partially_fulfilled",
            "partially_returned",
            "returned",
            "canceled",
          ].includes(active)
        )
          ? activeToggle.value
          : activeToggle.value.some((active) => ["captured"].includes(active))
          ? ["not_fulfilled"]
          : [],
        limit: limit.value,
        offset: offset.value,
      });
      count.value = res?.count;
      orders.value = res?.orders;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!isUser.value) {
      getOrdersList();
    }
  }, [offset.value, activeToggle.value]);

  // handle dialog
  const handleDialog = (index: number) => {
    if (dialogRef.current[index]?.open) {
      dialogRef.current[index]?.close();
    } else {
      dialogRef.current[index]?.show();
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
        const { first_name, last_name, phone } = formDataObj;
        if (isUser.value) {
          await user.updateUser({
            first_name: first_name.toString(),
            last_name: last_name.toString(),
            phone: phone.toString(),
          });
        } else {
          const updateRes = await adminUpdateCustomer({
            customerId: id,
            first_name: first_name.toString(),
            last_name: last_name.toString(),
            phone: phone.toString(),
          });
          userData.value = updateRes?.customer;
        }
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

  const handleEdit = async (id: string, index: number) => {
    (isUserEditPopUp.value = true), dialogRef.current[index]?.close();
  };

  const handleUploadIdCard = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "profile:govtId:upload";
    try {
      const uploadRes = await adminProtectedUploadFile(selectedFile.value);
      const file_key: string = uploadRes?.uploads[0]?.key;
      await adminUpdateCustomer({
        customerId: id,
        metadata: { govt_id_key: file_key },
      });

      uploadPopup.value = false;
      getUser();
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = undefined;
      selectedFile.value = null;
    }
  };

  const handleDeleteIdCard = async () => {
    isLoading.value = "profile:govtId:delete";
    try {
      if (!profileIdCardKey.value) return;
      await adminDeleteUploadFile(profileIdCardKey.value);
      await adminUpdateCustomer({
        customerId: id,
        metadata: { govt_id_key: "" },
      });
      isDeletePopup.value = false;
      window.location.reload();
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full relative">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">User Profile</Typography>
      </div>
      <div className="w-full mb-12 max-w-2xl">
        {isLoading.value !== "user:get" ? (
          <div className="w-full flex flex-col gap-2 ">
            <div className="w-full bg-secondray shadow-sm rounded-lg border p-4">
              <div className="flex justify-between items-center w-full relative">
                <div className=" w-full flex items-center gap-4">
                  <div className="w-full max-w-[5rem] h-20 flex relative">
                    {isUser.value ? (
                      <Chip className="!bg-primary-700 uppercase text-4xl w-full flex justify-center items-center text-white">
                        {userData.value?.first_name
                          ? userData.value?.first_name.charAt(0)
                          : userData.value?.email.charAt(0)}
                      </Chip>
                    ) : (
                      <img
                        src={
                          profileImageUrl.value ?? "/images/placeholderImg.svg"
                        }
                        alt="profile"
                        className="w-full border-2 p-1.5 rounded-full shadow"
                      />
                    )}
                    {!isUser.value ? (
                      <Button
                        variant="icon"
                        className="absolute right-0 -bottom-2 !rounded-full bg-gray-200"
                        onClick={() => (isProfileImageEdit.value = true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="2.0"
                          stroke="currentColor"
                          class="w-5 h-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                          />
                        </svg>
                      </Button>
                    ) : null}
                  </div>
                  <div>
                    {userData.value?.first_name ? (
                      <Typography
                        size="h6/bold"
                        className="capitalize"
                      >{`${userData.value?.first_name} ${userData.value?.last_name}`}</Typography>
                    ) : (
                      <Typography variant="secondary" className="capitalize">
                        {userData.value?.email}
                      </Typography>
                    )}
                    <Typography variant="secondary" className="break-all">
                      {userData.value?.email}
                    </Typography>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="icon"
                  onClick={() => handleDialog(0)}
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
                  index={0}
                  id={id}
                  isLoading={false}
                  handleEdit={handleEdit}
                  isPopup={isDeletePopup}
                />
              </div>
              <div className="flex items-center justify-around gap-4 mt-4">
                <Typography>
                  Phone: {userData.value?.phone ? userData.value?.phone : "N/A"}
                </Typography>
                <Typography>
                  Orders:{" "}
                  {userData.value?.orders?.length
                    ? userData.value?.orders?.length
                    : "N/A"}
                </Typography>
              </div>
            </div>

            {isUser.value ? <AddressList address={address} /> : null}

            {!isUser.value ? (
              <div className="w-full mb-20">
                <div className="p-2">
                  <Typography size="h6/medium">Govt. id</Typography>
                  <div className="flex flex-col items-center justify-center gap-4">
                    {!profileIdCardUrl.value ? (
                      <div>
                        <Typography
                          size="body2/normal"
                          variant="error"
                          className="my-4 text-center"
                        >
                          Govt. id not found
                        </Typography>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            uploadPopup.value = true;
                          }}
                        >
                          Upload here
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 items-center my-4 w-full">
                        <img
                          src={
                            profileIdCardUrl.value ??
                            "/images/placeholderImg.svg"
                          }
                          className="w-9/12 object-cover border rounded-lg sm:w-1/2"
                          alt="govt_id"
                        />
                        <Button
                          type="button"
                          variant="icon"
                          className="!text-danger-600 border-2  gap-2 !items-center"
                          onClick={() => (isDeletePopup.value = true)}
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-2">
                  <Typography size="h6/medium">Orders</Typography>
                  <Typography size="body2/normal">
                    An overview of user Orders
                  </Typography>
                </div>
                <OrderStatusToggle
                  activeToggle={activeToggle}
                  orders={orders}
                  isLoading={
                    isLoading.value === "user:oders:get" ? true : false
                  }
                  count={count.value}
                />

                {isLoading.value !== "user:oders:get" ? (
                  orders.value?.length ? (
                    <div className="w-full flex flex-col gap-4 mb-12 ">
                      {orders.value?.map((order) => (
                        <OrderItem order={order} page="orders" />
                      ))}
                      <OffsetPagination
                        limit={limit}
                        offset={offset}
                        count={count}
                      />
                    </div>
                  ) : (
                    <Typography>No order found</Typography>
                  )
                ) : (
                  <div className="h-40">
                    <Loading loadingText="loading" />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}

        <DeletePopUp
          id={id}
          index={0}
          isPopup={isDeletePopup}
          isLoading={isLoading.value === "profile:govtId:delete" ? true : false}
          title={`Are you sure you want to delete this Id card?`}
          subtitle="This will delete this permanently. You cannot undo this action"
          handlePopupAction={handleDeleteIdCard}
          actionText={"Yes, Confirm"}
        />

        {isLoading.value === "user:edit" ? (
          <LoadingPopUp loadingText="Please wait" />
        ) : isUserEditPopUp.value ? (
          <UserPopUp
            isPopup={isUserEditPopUp}
            handlePopupAction={handleUpdateUser}
            actionText="Update"
            type="edit"
            selectedId={id}
            formRef={formRef}
            errorMessage={errorMessage}
            variant="user"
          />
        ) : null}
        <PopUp
          isPopup={isPopUp}
          title={`User is updated
         successfully `}
          subtitle={`User ID: ${userData.value?.id} `}
        />
        {isProfileImageEdit.value ? (
          <div
            className="absolute right-0 top-0 backdrop-brightness-75 w-full h-full"
            onClick={() => (isProfileImageEdit.value = false)}
          />
        ) : null}
        {!isUser.value ? (
          <ProfileImageEdit
            isProfileImageEdit={isProfileImageEdit}
            customerId={id}
            profileImagekey={profileImageKey}
            profileImageUrl={profileImageUrl}
          />
        ) : null}
        {isLoading.value === "profile:govtId:upload" ? (
          <LoadingPopUp loadingText="Please wait" />
        ) : (
          <FileUploadPopup
            isPopup={uploadPopup}
            selectedFile={selectedFile}
            formRef={uploadFormRef}
            actionText="Upload"
            acceptFileType="image/png, image/jpeg"
            errorMessage={errorMessage}
            handlePopupAction={handleUploadIdCard}
          />
        )}
        <BottomNavbar />
      </div>
    </div>
  );
};

export default UserProfile;
