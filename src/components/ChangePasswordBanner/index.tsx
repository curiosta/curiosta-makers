import Button from "../Button";
import Typography from "../Typography";

const ChangePasswordBanner = ({ link }: { link: string }) => {
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-2 bg-neutral-50">
      <div className="border bg-secondray flex flex-col gap-3 items-center p-6 rounded-2xl shadow-lg sm:w-full sm:max-w-md w-11/12">
        <div className="bg-primary-700 p-4 rounded-full shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-8 h-8 fill-secondray"
          >
            <path
              fill-rule="evenodd"
              d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <Typography size="body1/semi-bold" variant="error">
          Please change your password
        </Typography>
        <Typography size="small/semi-bold" className="text-center">
          Without password change, you will not able to use this app.
        </Typography>
        <Button link={link}>Change password</Button>
      </div>
    </div>
  );
};

export default ChangePasswordBanner;
