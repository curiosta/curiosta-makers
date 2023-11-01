import Button from "@/components/Button";
import FormControl from "@/components/FormControl";
import SuccessAlert from "@/components/SuccessAlert";
import Typography from "@/components/Typography";
import Input from "@/components/Input";
import { Signal } from "@preact/signals";

type TPasswordRestForm = {
  email?: string;
  handleSubmit: (data: any) => Promise<void> | Promise<string>;
  successMessage: Signal<string>;
  errorMessage: Signal<string>;
  isLoading: Signal<boolean>;
};

const PasswordResetForm = ({
  email,
  isLoading,
  errorMessage,
  successMessage,
  handleSubmit,
}: TPasswordRestForm) => {
  return (
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center">
        <img class="h-20" src="/images/curiosta_logo.svg" alt="Curiosta" />
        <Typography
          tag="h2"
          size="h5/bold"
          variant="primary"
          className="mt-6 text-center  leading-9 tracking-tight"
        >
          Create new password
        </Typography>
      </div>

      <div class="mt-6 mx-auto sm:w-full sm:max-w-md w-11/12">
        <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <FormControl
            noValidate
            mode="onSubmit"
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
            <Input
              name="email"
              type="email"
              autocomplete="email"
              placeholder={"example@gmail.com"}
              className="hidden"
              value={email ? email : ""}
            />
            <Input
              name="password"
              type="password"
              label="New Password"
              autocomplete="new-password"
              required={{ value: true, message: "Password is required!" }}
              minLength={{
                value: 8,
                message: "Minimum 8 characters are required!",
              }}
              placeholder="New password"
              validator={(value) =>
                !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#_*])[A-Za-z\d@#_*]{8,}$/.test(
                  value
                )
                  ? "Your password should be of minimum 8 characters including at least one alphabet, number and one special character such as @, #, _, *"
                  : true
              }
              disabled={successMessage.value.length > 0}
            />
            <Input
              name="cpassword"
              type="password"
              label="Confirm Password"
              autocomplete="new-password"
              required={{ value: true, message: "Password is required!" }}
              minLength={{
                value: 8,
                message: "Minimum 8 characters are required!",
              }}
              placeholder="Confirm new password"
              disabled={successMessage.value.length > 0}
            />

            <Button
              type="submit"
              variant={"primary"}
              className="mt-4"
              disabled={isLoading.value || successMessage.value.length > 0}
            >
              {isLoading.value ? "Loading..." : "Change Password "}
            </Button>
            <Typography variant="error">{errorMessage}</Typography>
          </FormControl>
          <div class={`${successMessage.value ? "block mt-2" : "hidden"}`}>
            <SuccessAlert
              link="/login"
              linkText="Login"
              alertMessage={successMessage.value}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;
