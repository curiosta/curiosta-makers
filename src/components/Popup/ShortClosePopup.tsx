import { Signal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import Input from "../Input";
import { LineItem } from "@medusajs/medusa";
import { ChangeEvent } from "preact/compat";
import { MutableRef } from "preact/hooks";

type PopUp = {
  isPopup: Signal<boolean>;
  selectedItem: Signal<Omit<LineItem, "beforeInsert">>;
  actionText: string;
  formRef: MutableRef<HTMLFormElement>;
  handlePopupAction?: (e: ChangeEvent<HTMLFormElement>) => void;
};

const ShortClosePopup = ({
  isPopup,
  selectedItem,
  handlePopupAction,
  formRef,
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
      <div className="absolute w-10/12 bg-secondray  rounded-2xl transition-all p-6 max-w-sm">
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
        <form onSubmit={handlePopupAction} ref={formRef}>
          <div className="flex gap-4 items-center justify-center w-full my-4">
            <Typography>Actual Picked</Typography>
            <input
              type="number"
              className="w-12 text-center rounded-lg disabled:bg-gray-100"
              value={selectedItem.value?.quantity}
              name="actual_qty"
              min={1}
              max={selectedItem.value?.variant?.inventory_quantity}
            />
          </div>
          <div className="w-full flex items-center justify-evenly">
            <Button
              type="submit"
              className={`capitalize ${actionText ? "flex" : "hidden"}`}
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
        </form>
      </div>
    </div>
  );
};

export default ShortClosePopup;
