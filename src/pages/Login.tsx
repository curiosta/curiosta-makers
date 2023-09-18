import Button from "@components/Button";
import Typography from "@components/Typography";
import Input from "@components/Input";
import FormControl from "@components/FormControl";
import { useSignal } from "@preact/signals";
import { Link } from "preact-router/match";
import user from "@api/user";
import { isUser } from "@store/userState";
import admin from "@api/admin";

const Login = () => {
  const errorMessage = useSignal<string>("");
  const isLoading = useSignal<boolean>(false);

  const handleLoginUser = async (data: any) => {
    isLoading.value = true;
    if (errorMessage.value) {
      errorMessage.value = "";
    }
    const path = location.pathname;
    try {
      if (isUser.value) {
        await user.login(data);
      } else {
        await admin.login(data);
      }
      if (path !== "/login") {
        window.location.href = path;
      } else {
        window.location.href = "/home";
      }
    } catch (error) {
      const errorResponse = (error as any)?.toJSON?.();
      if (errorResponse) {
        errorMessage.value =
          "Failed to login, Please check email and password!.";
      }
    } finally {
      isLoading.value = false;
    }
  };
  localStorage.setItem("userRole", JSON.stringify({ isUser: isUser.value }));
  return (
    <div className="flex justify-center p-4">
      <div className="flex flex-col justify-center items-center  w-full sm:w-1/4 ">
        <div className="flex flex-col  items-center gap-2.5 ">
          <img src="/images/curiosta_logo.svg" alt="curiosta-logo" />
          <Typography size="h6/bold" className="text-center">
            Makerspace Management System
          </Typography>

          <Button
            type="button"
            variant="icon"
            className=" relative h-8 w-32 !p-0 !justify-normal flex-shrink-0 bg-gray-200 rounded-full border-2 
            border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2"
            onClick={() => (isUser.value = !isUser.value)}
          >
            <span
              aria-hidden="true"
              class={`${
                isUser.value ? "translate-x-0" : "translate-x-full"
              }  pointer-events-none flex items-center justify-center h-full w-1/2 transform rounded-full
               bg-primary-700 text-secondray shadow ring-0 transition duration-200 ease-in-out`}
            >
              {isUser.value ? "User" : "Admin"}
            </span>

            <span
              class={`${
                isUser.value ? "translate-x-0" : "-translate-x-full"
              }  pointer-events-none flex items-center justify-center h-full w-1/2 transform text-gray-600  transition duration-200 ease-in-out`}
            >
              {isUser.value ? "Admin" : "User"}
            </span>
          </Button>
        </div>

        <div className="w-full p-4">
          <FormControl
            noValidate
            mode="onSubmit"
            onSubmit={handleLoginUser}
            className="flex flex-col gap-2"
          >
            <Input
              name="email"
              type="email"
              leftAdornment={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.00037 8.29981C6.2268 8.29981 4.78524 6.86464 4.78524 5.09988C4.78524 3.33511 6.2268 1.89994 8.00037 1.89994C9.77393 1.89994 11.2155 3.33511 11.2155 5.09988C11.2155 6.86464 9.77393 8.29981 8.00037 8.29981ZM11.0211 8.83818C11.6821 8.31186 12.1918 7.6198 12.4985 6.83246C12.8051 6.04512 12.8976 5.19058 12.7667 4.35585C12.4491 2.25749 10.6955 0.578364 8.57796 0.333569C5.65642 -0.00482461 3.17807 2.25914 3.17807 5.09988C3.17807 6.61185 3.88205 7.959 4.97963 8.83818C2.28208 9.84696 0.312521 12.2157 0.00372759 15.4125C-0.00706903 15.5246 0.00565076 15.6378 0.0410682 15.7447C0.0764855 15.8516 0.133824 15.9499 0.209418 16.0334C0.285012 16.1169 0.377196 16.1837 0.480079 16.2295C0.582962 16.2754 0.694282 16.2993 0.806916 16.2997C1.00435 16.3012 1.19525 16.2291 1.3422 16.0972C1.48915 15.9654 1.58156 15.7833 1.6013 15.5869C1.92369 12.0165 4.67004 9.89978 8.00037 9.89978C11.3307 9.89978 14.077 12.0165 14.3994 15.5869C14.4192 15.7833 14.5116 15.9654 14.6585 16.0972C14.8055 16.2291 14.9964 16.3012 15.1938 16.2997C15.6706 16.2997 16.0418 15.8853 15.9962 15.4125C15.6882 12.2157 13.7186 9.84696 11.0203 8.83818"
                    fill="#0B7278"
                  />
                </svg>
              }
              autocomplete="email"
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
              leftAdornment={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="22"
                  viewBox="0 0 16 22"
                  fill="none"
                >
                  <path
                    d="M14 7.79999H13V5.79999C13 3.03999 10.76 0.799988 8 0.799988C5.24 0.799988 3 3.03999 3 5.79999V7.79999H2C0.9 7.79999 0 8.69999 0 9.79999V19.8C0 20.9 0.9 21.8 2 21.8H14C15.1 21.8 16 20.9 16 19.8V9.79999C16 8.69999 15.1 7.79999 14 7.79999ZM5 5.79999C5 4.13999 6.34 2.79999 8 2.79999C9.66 2.79999 11 4.13999 11 5.79999V7.79999H5V5.79999ZM14 19.8H2V9.79999H14V19.8ZM8 16.8C9.1 16.8 10 15.9 10 14.8C10 13.7 9.1 12.8 8 12.8C6.9 12.8 6 13.7 6 14.8C6 15.9 6.9 16.8 8 16.8Z"
                    fill="#0B7278"
                  />
                </svg>
              }
              autocomplete="current-password"
              required={{ value: true, message: "Password is required!" }}
              minLength={{
                value: 6,
                message: "Minimum 6 characters are required!",
              }}
              placeholder="Your Curiosta password"
            />
            <div class="flex items-center justify-end">
              <div class="text-sm leading-6">
                <Link
                  href="/forgot-password"
                  class="font-semibold text-app-primary-600 hover:text-app-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant={"primary"}
              className="mt-4 !w-full"
              disabled={isLoading.value}
            >
              {isLoading.value ? "Loading..." : "Login"}
            </Button>
            <Typography variant="error">{errorMessage}</Typography>
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default Login;
