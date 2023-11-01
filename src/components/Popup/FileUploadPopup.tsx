import { Signal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import { ChangeEvent } from "preact/compat";
import { MutableRef } from "preact/hooks";
import FileInput from "../FileInput";

type PopUp = {
  isPopup: Signal<boolean>;
  actionText: string;
  formRef: MutableRef<HTMLFormElement>;
  handlePopupAction?: (e: ChangeEvent<HTMLFormElement>) => void;
  errorMessage: Signal<string | null>;
  selectedFile: Signal<File | null>;
  acceptFileType?: string;
};

const FileUploadPopup = ({
  isPopup,
  handlePopupAction,
  formRef,
  actionText,
  errorMessage,
  selectedFile,
  acceptFileType,
}: PopUp) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-10 backdrop-brightness-75 items-center justify-center ${
        isPopup.value ? "flex " : "hidden"
      }`}
    >
      {/* close on outside click */}
      <div
        className="block w-full h-full"
        onClick={() => (isPopup.value = false)}
      />
      <div className="absolute w-10/12 bg-secondray  rounded-2xl transition-all p-6 max-w-sm">
        <Typography className="capitalize">Upload File</Typography>

        <form
          onSubmit={handlePopupAction}
          encType="multipart/form-data"
          ref={formRef}
          required
        >
          <div className="flex flex-col gap-4 items-center justify-center w-full my-4">
            <FileInput
              selectedFile={selectedFile}
              acceptFileType={acceptFileType}
            />
          </div>
          <div className="w-full flex items-center justify-evenly">
            <Button
              type="submit"
              className={`capitalize ${actionText ? "flex" : "hidden"}`}
              disabled={!selectedFile.value}
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
        </form>
      </div>
    </div>
  );
};

export default FileUploadPopup;
