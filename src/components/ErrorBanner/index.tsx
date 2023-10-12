import Typography from "../Typography";

const ErrorBanner = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-2 ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16  text-danger-600"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>

      <Typography size="body1/semi-bold" variant="error">
        {errorMessage}
      </Typography>
      <Typography size="small/semi-bold">Please try again later.</Typography>
    </div>
  );
};

export default ErrorBanner;
