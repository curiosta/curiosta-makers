import Button from "@components/Button";
import Typography from "@components/Typography";
import logo from "@assets/curiosta_logo.png";
import google_logo from "@assets/google_logo.png";
import Input from "@components/Input";
import FormControl from "@components/FormControl";
import { useSignal } from "@preact/signals";
import { route } from "preact-router";
import { Link } from "preact-router/match";

const Login = () => {
  const errorMessage = useSignal<string>("");
  const isLoading = useSignal<boolean>(false);

  const handleLoginUser = (data: any) => {
    isLoading.value = true;
    if (errorMessage.value) {
      errorMessage.value = "";
    }
    try {
      route("/home");
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

  return (
    <div className="flex justify-center p-4">
      <div className="flex flex-col justify-center items-center  w-full sm:w-1/4 ">
        <div className="flex flex-col  items-center gap-2.5 ">
          <img src={logo} alt="curiosta-logo" />
          <Typography size="h6/bold" className="text-center">
            IMS
          </Typography>
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
              label="Email address"
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
              label="Password"
              autocomplete="current-password"
              required={{ value: true, message: "Password is required!" }}
              minLength={{
                value: 8,
                message: "Minimum 8 characters are required!",
              }}
              placeholder="Your Curiosta password"
            />
            <div class="flex items-center justify-end">
              <div class="text-sm leading-6">
                <Link
                  href="#"
                  class="font-semibold text-app-primary-600 hover:text-app-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant={"primary"}
              className="mt-4"
              disabled={isLoading.value}
            >
              {isLoading.value ? "Loading..." : "Login"}
            </Button>
            <Typography variant="error">{errorMessage}</Typography>
          </FormControl>
          <div className="text-center my-4">
            <Typography>or</Typography>
            <div className="p-1.5 rounded-lg border flex justify-center items-center my-2 ">
              <div className="justify-start items-center gap-1 inline-flex">
                <img className="w-9 h-8" src={google_logo} alt="google-logo" />
                <Typography size="body2/normal">Sign in with google</Typography>
              </div>
            </div>
            <Typography
              size="body1/normal"
              variant={"secondary"}
              className="text-center"
            >
              Don't have an account?{" "}
              <a
                href="/signup"
                class="font-semibold leading-6 text-app-primary-600 hover:text-app-primary-500"
              >
                Sign up
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
