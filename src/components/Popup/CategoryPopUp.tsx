import { Signal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import Input from "../Input";
import { LineItem } from "@medusajs/medusa";
import { ChangeEvent } from "preact/compat";
import { MutableRef } from "preact/hooks";
import Select from "../Select";
import FormControl from "../FormControl";

type PopUp = {
  isPopup: Signal<boolean>;
  actionText: string;
  formRef: MutableRef<HTMLFormElement>;
  handlePopupAction?: (e: ChangeEvent<HTMLFormElement>) => void;
  errorMessage: Signal<string | null>;
};

const CategoryPopup = ({
  isPopup,
  handlePopupAction,
  formRef,
  actionText,
  errorMessage,
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
        <Typography>Add Category</Typography>
        <FormControl
          noValidate
          mode="onSubmit"
          onSubmit={handlePopupAction}
          ref={formRef}
        >
          <div className="flex flex-col gap-4 items-center justify-center w-full my-4">
            <Input
              type="text"
              name="categoryName"
              label="Name"
              required={{ value: true, message: "Name is required!" }}
            />
            <Input type="text" name="categoryDescription" label="Description" />
            <div className="w-full flex items-center justify-between ">
              <Select
                name="status"
                options={["Active", "Inactive"]}
                label="Status"
              />
              <Select
                name="visibility"
                options={["Public", "Private"]}
                label="Visibility"
              />
            </div>
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
          {errorMessage.value ? (
            <Typography variant="error" className="text-center mt-2">
              {errorMessage.value}
            </Typography>
          ) : null}
        </FormControl>
      </div>
    </div>
  );
};

export default CategoryPopup;
