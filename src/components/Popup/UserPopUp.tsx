import { Signal, useSignal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import { ChangeEvent } from "preact/compat";
import { MutableRef, useEffect } from "preact/hooks";
import { Customer, User } from "@medusajs/medusa";
import NewInput from "../Input/NewInput";
import { adminGetCustomer } from "@/api/admin/customers/getCustomer";
import { adminGetuser } from "@/api/admin/adminUsers/getAdminUser";
import { isUser } from "@/store/userState";
import user, { TCustomer } from "@/api/user";

type PopUp = {
  isPopup: Signal<boolean>;
  actionText: string;
  formRef: MutableRef<HTMLFormElement>;
  handlePopupAction?: (e: ChangeEvent<HTMLFormElement>) => void;
  errorMessage: Signal<string | null>;
  type: "add" | "edit";
  variant: "adminUser" | "user";
  selectedId?: string;
};

type TUser = User & {
  phone: string;
};

const UserPopUp = ({
  isPopup,
  handlePopupAction,
  formRef,
  actionText,
  errorMessage,
  selectedId,
  type,
  variant,
}: PopUp) => {
  const isLoading = useSignal<boolean>(false);
  const userData = useSignal<TUser | TCustomer | null>(null);

  const getUser = async () => {
    isLoading.value = true;

    try {
      if (isUser.value) {
        userData.value = user.customer.value;
      } else {
        if (!selectedId?.length) return;
        const userRes =
          variant === "user"
            ? await adminGetCustomer({
                customerId: selectedId,
              })
            : await adminGetuser({
                userId: selectedId,
              });

        userData.value = variant === "user" ? userRes?.customer : userRes?.user;
      }
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    if (type === "edit") {
      getUser();
    }
  }, [selectedId]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full backdrop-brightness-75 z-[15] items-center justify-center ${
        isPopup.value ? "flex " : "hidden"
      }`}
    >
      {/* close on outside click */}
      <div
        className="block w-full h-full"
        onClick={() => (isPopup.value = false)}
      />
      <div className="absolute w-10/12 bg-secondray  rounded-2xl transition-all p-6 sm:w-1/3">
        <Typography size="body1/semi-bold" className="capitalize">
          {type === "add" ? "Add" : "Update"}{" "}
          {variant === "adminUser" ? "Admin" : "User"}
        </Typography>

        <form onSubmit={handlePopupAction} ref={formRef} required>
          <div className="flex flex-col gap-4 items-center justify-center w-full my-4">
            {type === "edit" ? (
              <Typography className="break-all">
                Email: {userData.value?.email}
              </Typography>
            ) : null}
            <NewInput
              name="first_name"
              label="First Name"
              type="text"
              minLength={3}
              maxLength={20}
              defaultValue={type === "edit" ? userData.value?.first_name : ""}
              required
            />
            <NewInput
              name="last_name"
              label="Last Name"
              type="text"
              minLength={3}
              maxLength={20}
              defaultValue={type === "edit" ? userData.value?.last_name : ""}
              required
            />
            {variant === "user" ? (
              <NewInput
                name="phone"
                type="tel"
                label="Phone Number"
                autocomplete="phone"
                pattern="(\+91)?(-)?\s*?(91)?\s*?(\d{3})-?\s*?(\d{3})-?\s*?(\d{4})"
                placeholder={"+91 9876543210"}
                title="Invalid phone number"
                defaultValue={type === "edit" ? userData.value?.phone : ""}
                required
              />
            ) : null}
            {type === "add" ? (
              <>
                <NewInput
                  type="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  placeholder="example@gmail.com"
                  required
                />

                <NewInput
                  type="password"
                  label="Password"
                  name="password"
                  autocomplete="current-password"
                  placeholder="Add new password"
                  required
                />
              </>
            ) : null}
          </div>
          <div className="w-full flex items-center justify-evenly">
            <Button
              type="submit"
              className={`capitalize ${actionText ? "flex" : "hidden"}`}
              disabled={isLoading.value}
            >
              {isLoading.value ? "loading..." : actionText}
            </Button>

            <Button
              type="button"
              variant="danger"
              onClick={() => (isPopup.value = false)}
            >
              Close
            </Button>
          </div>
          {errorMessage.value ? (
            <Typography variant="error" className="text-center mt-2">
              {errorMessage.value}
            </Typography>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default UserPopUp;
