import { useSignal } from "@preact/signals";
import user from "@/api/user";
import { isUser } from "@/store/userState";
import admin from "@/api/admin";
import PasswordResetForm from "@/components/PasswordResetFrom";

const PasswordReset = () => {
  const isLoading = useSignal<boolean>(false);
  const errorMessage = useSignal<string>("");
  const successMessage = useSignal<string>("");

  const currentUrl = new URL(window.location.href);
  const token = currentUrl.searchParams.get("token");
  const email = currentUrl.searchParams.get("email");

  const handlePasswordReset = async (data: any) => {
    isLoading.value = true;
    const { password, cpassword } = data;
    if (errorMessage.value || successMessage.value) {
      errorMessage.value = "";
      successMessage.value = "";
    }
    try {
      if (!token || !email) {
        return (errorMessage.value = "Email or Token not found in url params");
      }

      if (password === cpassword) {
        isUser.value
          ? await user.passwordReset({ email, password, token })
          : await admin.passwordReset({ email, password, token });
        successMessage.value = "Your password has been changed successfully!";
      } else {
        errorMessage.value = "Password and confirmation password do not match.";
      }
    } catch (error) {
      const errorResponse = (error as any)?.toJSON?.();
      if (errorResponse) {
        errorMessage.value = "Failed to add new password!.";
      }
    } finally {
      isLoading.value = false;
    }
  };
  return (
    <PasswordResetForm
      email={email}
      handleSubmit={handlePasswordReset}
      errorMessage={errorMessage}
      successMessage={successMessage}
      isLoading={isLoading}
    />
  );
};

export default PasswordReset;
