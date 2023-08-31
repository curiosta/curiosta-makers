import { Signal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import Input from "../Input";
import { LineItem } from "@medusajs/medusa";

type PopUp = {
  isPopup: Signal<boolean>;
  selectedItem: Signal<LineItem>;
  actionText: string;
  handlePopupAction?: () => void;
};

const ShortClosePopup = ({
  isPopup,
  selectedItem,
  handlePopupAction,
  actionText,
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
        <div className="flex gap-4 items-center justify-center w-full">
          <Typography>To Be Picked</Typography>
          <div className="w-12">
            <Input
              type="number"
              className="text-center disabled:bg-gray-100"
              value={selectedItem.value?.quantity}
              disabled={true}
            />
          </div>
        </div>
        <div className="flex gap-4 items-center justify-center w-full my-4">
          <Typography>Actual Picked</Typography>
          <div className="w-12">
            <Input
              type="number"
              className="text-center disabled:bg-gray-100"
              value={3}
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-evenly">
          <Button
            type="button"
            className={`capitalize ${actionText ? "flex" : "hidden"}`}
            onClick={handlePopupAction}
          >
            {actionText}
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={() => (isPopup.value = false)}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShortClosePopup;
