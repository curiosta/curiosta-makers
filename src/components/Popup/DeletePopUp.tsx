import Button from "@components/Button";
import Typography from "@components/Typography";
import { Signal } from "@preact/signals";

type TPopUp = {
  title: string;
  id: string;
  index: number;
  subtitle?: string;
  isPopup: Signal<boolean>;
  actionText?: string;
  actionLink?: string;
  handlePopupAction: (
    id: string,
    index: number,
    email?: string
  ) => Promise<void>;
  errorMessage?: string;
  isLoading: boolean;
  email?: string;
};

const DeletePopUp = ({
  title,
  subtitle,
  id,
  index,
  isPopup,
  actionText,
  actionLink,
  handlePopupAction,
  errorMessage,
  isLoading,
  email,
}: TPopUp) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-20 backdrop-brightness-75 items-center justify-center ${
        isPopup.value ? "flex " : "hidden"
      }`}
    >
      {/* close on outside click */}
      <div
        className="block w-full h-full"
        onClick={() => (!isLoading ? (isPopup.value = false) : undefined)}
      />
      <div
        className={`absolute ${
          isLoading ? "w-fit" : "w-10/12 sm:w-1/3"
        } bg-secondray  rounded-2xl transition-all p-6`}
      >
        <div className="flex flex-col text-center gap-2 ">
          {isLoading ? (
            <Typography
              size="body1/semi-bold"
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class={"animate-spin w-6 stroke-primary-600 duration-500"}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Please Wait...
            </Typography>
          ) : (
            <>
              <Typography size="body1/semi-bold">{title}</Typography>
              {subtitle ? (
                <Typography size="body2/normal" className="break-words">
                  {subtitle}
                </Typography>
              ) : null}
            </>
          )}
        </div>

        {!isLoading ? (
          <div className=" w-full flex items-center justify-evenly mt-4">
            {actionLink ? (
              <Button link={actionLink}>{actionText}</Button>
            ) : (
              <Button
                type="button"
                variant="danger"
                className={`${actionText ? "flex" : "hidden"}`}
                onClick={() => handlePopupAction(id, index, email)}
              >
                {actionText}
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              className="!py-3"
              onClick={() => (isPopup.value = false)}
            >
              Cancel
            </Button>
          </div>
        ) : null}
        {errorMessage ? (
          <Typography variant="error" className="text-center mt-2">
            {errorMessage}
          </Typography>
        ) : null}
      </div>
    </div>
  );
};

export default DeletePopUp;
