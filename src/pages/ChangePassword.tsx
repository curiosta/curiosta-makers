import user from "@/api/user";
import PasswordResetForm from "@/components/PasswordResetFrom";
import { useSignal } from "@preact/signals";

const ChangePassword = () => {
  const isLoading = useSignal<boolean>(false);
  const errorMessage = useSignal<string>("");
  const successMessage = useSignal<string>("");

  const handlePasswordReset = async (data: any) => {
    isLoading.value = true;
    const { password, cpassword } = data;
    if (errorMessage.value || successMessage.value) {
      errorMessage.value = "";
      successMessage.value = "";
    }
    try {
      if (password === cpassword) {
        await user.updateUser({
          password,
          metadata: { new_account: false, temp_password: "" },
        });
        await user.logout();
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
      handleSubmit={handlePasswordReset}
      errorMessage={errorMessage}
      successMessage={successMessage}
      isLoading={isLoading}
    />
  );
};

export default ChangePassword;
