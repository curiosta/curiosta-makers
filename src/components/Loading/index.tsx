import Typography from "@components/Typography";

const Loading = () => {
  return (
    <div className="w-full h-full flex justify-center">
      <div className="flex justify-center items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="30"
          viewBox="0 0 12 20"
          fill="none"
        >
          <path
            d="M12 20L11.99 14L8 10L11.99 5.99L12 0H0V6L4 10L0 13.99V20H12ZM2 5.5V2H10V5.5L6 9.5L2 5.5Z"
            fill="#0B7278"
          />
        </svg>
        <Typography size="body1/semi-bold">Loading...</Typography>
      </div>
    </div>
  );
};

export default Loading;
