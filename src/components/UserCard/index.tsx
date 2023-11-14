import Typography from "../Typography";
import Chip from "../Chip";
import Button from "../Button";
import Radio from "../Radio";
import { Signal, useSignal } from "@preact/signals";
import { isUser } from "@/store/userState";
import { TCustomer } from "@/api/user";
import { adminGetProtectedUploadFile } from "@/api/admin/upload/getProtectedUpload";
import { useEffect } from "preact/hooks";
import { route } from "preact-router";

type TUserCard = {
  user: TCustomer;
  activeToggle?: "active" | "inactive";
  handleEdit?: (id: string) => void;
  handleActiveInactive?: (user: TCustomer) => void;
  selectedUser?: Signal<TCustomer>;
};

const UserCard = ({
  user,
  activeToggle,
  handleEdit,
  handleActiveInactive,
  selectedUser,
}: TUserCard) => {
  const isLoading = useSignal<boolean>(false);
  const profileImageUrl = useSignal<string | null>(null);

  const getPrfileImage = async () => {
    isLoading.value = true;
    try {
      if (!isUser.value) {
        if (!user?.metadata?.profile_image_key) return;
        const { profile_image_key } = user?.metadata;
        const profileImageUploadRes = await adminGetProtectedUploadFile({
          file_key: profile_image_key,
        });
        profileImageUrl.value = profileImageUploadRes?.download_url;
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    getPrfileImage();
  }, []);

  const handleSelectedUser = () => {
    selectedUser.value = user;
    localStorage.setItem("draftUser", JSON.stringify(selectedUser.value));
    route("/create-requests");
  };

  return (
    <div
      className={`${
        !activeToggle && selectedUser.value?.email === user.email
          ? "bg-primary-600/10"
          : "bg-secondary"
      }  border flex items-center justify-between p-4 relative rounded-lg shadow-lg w-full`}
    >
      <div className="flex flex-col gap-4 w-10/12">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            {user?.metadata?.profile_image_key ? (
              <img
                src={profileImageUrl.value ?? "/images/placeholderImg.svg"}
                alt="profile"
                className="object-fit h-10 w-10 border rounded-full shadow"
              />
            ) : (
              <Chip
                variant="primary2"
                className="!bg-third-600 !rounded-full uppercase h-10 w-10 !text-white"
              >
                {user.first_name
                  ? user.first_name.charAt(0)
                  : user.email.charAt(0)}
              </Chip>
            )}

            {user?.first_name ? (
              <Typography className="capitalize">{`${user?.first_name} ${user?.last_name}`}</Typography>
            ) : (
              <Typography variant="secondary" className="capitalize">
                {user?.email}
              </Typography>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5 fill-third-600"
            >
              <path
                fill-rule="evenodd"
                d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                clip-rule="evenodd"
              />
            </svg>
            <Typography>{user?.phone ? user.phone : "N/A"}</Typography>
          </div>
          <div className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5 fill-third-600"
            >
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
            <Typography className="text-start w-10/12 break-words">
              {user?.email}
            </Typography>
          </div>

          <div className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-5 h-5 fill-third-600"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>

            {user.billing_address ? (
              <Typography className="text-start w-10/12 break-words">
                {user?.billing_address?.city}
                {", "}
                {user?.billing_address?.province}
                {", "}
                {user?.billing_address?.postal_code}
              </Typography>
            ) : (
              <Typography>N/A</Typography>
            )}
          </div>
        </div>
      </div>
      {activeToggle ? (
        <div className="flex flex-col gap-4 justify-end">
          {activeToggle === "active" ? (
            <>
              <Button
                link={`/user/${user.id}`}
                variant="icon"
                className="z-10 text-third-500 !rounded-full border gap-2 sm:px-4 !shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6"
                >
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path
                    fill-rule="evenodd"
                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                    clip-rule="evenodd"
                  />
                </svg>

                <Typography className="hidden sm:block">View</Typography>
              </Button>
              <Button
                type="button"
                variant="icon"
                title="Edit"
                onClick={() => handleEdit(user.id)}
                className="z-10 text-third-500 !rounded-full border gap-2 sm:px-4 !shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6"
                >
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                </svg>
                <Typography className="hidden sm:block">Edit</Typography>
              </Button>
            </>
          ) : null}
          <Button
            type="button"
            variant="icon"
            title={activeToggle === "active" ? "Deactivate" : "Activate"}
            onClick={() => handleActiveInactive(user)}
            className={`z-10 sm:px-4 gap-2 !rounded-full border !shadow-sm ${
              activeToggle === "active" ? "text-third-500" : "text-danger-600"
            }  `}
          >
            {activeToggle === "active" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                  clip-rule="evenodd"
                />
              </svg>
            )}
            <Typography className="hidden sm:block">
              {activeToggle === "active" ? "Deactivate" : "Activate"}
            </Typography>
          </Button>
        </div>
      ) : (
        <label className="p-4 cursor-pointer ">
          <Radio
            name="user"
            className="sr-only"
            value={user.email}
            onClick={handleSelectedUser}
          />
          {selectedUser.value?.email === user.email ? (
            <svg
              class="h-6 w-6 text-app-primary-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          ) : (
            <div className="border border-primary-600 bg-secondary rounded-full w-5 h-5"></div>
          )}
        </label>
      )}
    </div>
  );
};

export default UserCard;
