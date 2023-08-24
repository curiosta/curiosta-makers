import Button from "@components/Button";
import Typography from "@components/Typography";
import Input from "@components/Input";
import FormControl from "@components/FormControl";
import { useSignal } from "@preact/signals";
import { route } from "preact-router";
import Checkbox from "@components/Checkbox";
import user from "@/api/user";
import { useRef } from "preact/hooks";

const Signup = () => {
  const errorMessage = useSignal<string>("");
  const isLoading = useSignal<boolean>(false);
  const isChecked = useSignal<boolean>(true);

  const handleCreateUser = async (data: any) => {
    isLoading.value = true;
    if (errorMessage.value) {
      errorMessage.value = "";
    }
    const { first_name, last_name, email, password, cpassword } = data;

    try {
      if (password === cpassword) {
        if (!isChecked.value)
          return (errorMessage.value = "Please checked terms and conditions!");
        await user.register({ first_name, last_name, email, password });
        if (!isChecked.value)
          return (errorMessage.value = "Please checked terms and conditions!");
        await user.register({ first_name, last_name, email, password });
        route("/home");
      } else {
        errorMessage.value = "Password and confirmation password do not match!";
        errorMessage.value = "Password and confirmation password do not match!";
      }
    } catch (error) {
      const errorResponse = (error as any)?.toJSON?.();
      if (errorResponse) {
        errorMessage.value = "Failed to create account!";
        errorMessage.value = "Failed to create account!";
      }
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="flex flex-col justify-center items-center  w-full sm:w-1/4 ">
        <div className="flex flex-col  items-center gap-2.5 ">
          <img src="/images/curiosta_logo.svg" alt="curiosta-logo" />
          <Typography size="h6/bold" className="text-center uppercase">
            MMS
          </Typography>
        </div>
        <div className="w-full p-4">
          <FormControl
            noValidate
            mode="onSubmit"
            className="flex flex-col gap-2"
            onSubmit={handleCreateUser}
          >
            <div class="flex justify-between items-center gap-2">
              <Input
                name="first_name"
                type="text"
                label="First Name"
                autocomplete="given-name"
                required={{ message: "First name is required!", value: true }}
                minLength={{
                  message: "Minimum 3 characters are required!",
                  value: 3,
                }}
                maxLength={20}
                placeholder="John"
              />

              <Input
                name="last_name"
                type="text"
                label="Last Name"
                required={{ message: "Last name is required!", value: true }}
                autocomplete="family-name"
                minLength={{
                  message: "Minimum 3 characters are required!",
                  value: 3,
                }}
                maxLength={20}
                placeholder={"Doe"}
              />
            </div>

            <Input
              name="email"
              type="email"
              label="Email address"
              autocomplete="email"
              required={{ message: "Email is required!", value: true }}
              placeholder={"example@gmail.com"}
              validator={(value) =>
                !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
                  ? "Invalid email!"
                  : true
              }
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
            />

            <Checkbox
              name="terms"
              label="I agree to the Terms and Conditions and Privacy Policy"
              defaultChecked={true}
              onChange={(e) => (isChecked.value = e.currentTarget.checked)}
            />
            <Checkbox
              name="terms"
              label="I agree to the Terms and Conditions and Privacy Policy"
              defaultChecked={true}
              onChange={(e) => (isChecked.value = e.currentTarget.checked)}
            />

            <Button
              type="submit"
              variant="primary"
              className="mt-4 !w-full"
              disabled={isLoading.value}
            >
              {isLoading.value ? "Loading..." : "Sign Up"}
            </Button>

            <Typography variant="error">{errorMessage}</Typography>
          </FormControl>
          <div className="text-center my-4">
            <Typography>or</Typography>
            <div className="p-1.5 rounded-lg border flex justify-center items-center my-2 shadow-sm ">
              <div className="justify-start items-center gap-1 inline-flex">
                <img
                  className="w-9 h-8"
                  src="/images/google_logo.svg"
                  alt="google-logo"
                />
                <Typography size="body2/normal">Sign up with google</Typography>
              </div>
            </div>
            <Typography
              size="body1/normal"
              variant={"secondary"}
              className="text-center"
            >
              Have an account?{" "}
              <a
                href="/login"
                class="font-semibold leading-6 text-app-primary-600 hover:text-app-primary-500"
              >
                Login
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
