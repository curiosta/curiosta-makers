import { Signal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";

type PopUp = {
  isPopup: Signal<boolean>;
  title: string;
  subTitle?: string;
  handlePopupAction?: () => void;
};

const SelectionPopup = ({
  isPopup,
  title,
  subTitle,
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
          <Typography>{title}</Typography>
          {subTitle ? <Typography>{subTitle}</Typography> : null}
        </div>
      </div>
    </div>
  );
};

export default SelectionPopup;
