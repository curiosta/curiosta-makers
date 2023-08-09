import { Signal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import { ChangeEvent } from "preact/compat";

type PopUp = {
  isPopup: Signal<boolean>;
  content: string;
  subcontent?: string;
  actionText: string;
  actionLink?: string;
  handlePopupAction?: () => void;
};

const index = ({
  isPopup,
  content,
  subcontent,
  actionText,
  actionLink,
  handlePopupAction,
}: PopUp) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full backdrop-brightness-75 items-center justify-center ${
        isPopup.value ? "flex " : "hidden"
      }`}
    >
      {/* close on outside click */}
      <div
        className="block w-full h-full"
        onClick={() => (isPopup.value = false)}
      />
      <div
        className={`absolute w-10/12 bg-secondray  rounded-2xl transition-all p-6`}
      >
        <div className="flex flex-col text-center gap-2 mb-4">
          <Typography>{content}</Typography>
          {subcontent ? <Typography>{subcontent}</Typography> : null}
        </div>

        <div className=" w-full flex items-center justify-evenly">
          {actionLink ? (
            <Button link={actionLink}>{actionText}</Button>
          ) : (
            <Button type="button" onClick={handlePopupAction}>
              {actionText}
            </Button>
          )}
          <Button
            type="button"
            variant="danger"
            onClick={() => (isPopup.value = false)}
          >
            Closed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default index;
