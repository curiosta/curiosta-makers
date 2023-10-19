import { Signal, useSignal } from "@preact/signals";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import Typography from "../Typography";
import { TBiometricInfo } from "@pages/CreateUser";
import LoadingPopUp from "../Popup/LoadingPopUp";
import FileUploadPopup from "../Popup/FileUploadPopup";
import { useRef } from "preact/hooks";
import { ChangeEvent } from "preact/compat";
import { adminProtectedUploadFile } from "@/api/admin/upload/protectedUploadFile";
import FormControl from "../FormControl";

type TUserBiometricInfo = {
  biometricInfo: Signal<TBiometricInfo>;
};
type TLoadableOptions = "profile:image:upload" | "idCard:upload";

const UserBiometricInfo = ({ biometricInfo }: TUserBiometricInfo) => {
  const numberOfIds = useSignal<number>(1);
  const selectedFile = useSignal<File | null>(null);
  const uploadPopup = useSignal<boolean>(false);
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const errorMessage = useSignal<string | null>(null);

  const handleUploadIdCard = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "idCard:upload";
    try {
      const uploadRes = await adminProtectedUploadFile(selectedFile.value);
      const file_key: string = uploadRes?.uploads[0]?.key;
      uploadPopup.value = false;
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = undefined;
      selectedFile.value = null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6 fill-third-600"
        >
          <path
            fill-rule="evenodd"
            d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z"
            clip-rule="evenodd"
          />
        </svg>
        <Typography>Identification Proof</Typography>
      </div>
      <FormControl>
        {Array(numberOfIds.value)
          .fill(1)
          .map((index) => (
            <div className="flex flex-col gap-2.5">
              <Select
                name="idCard_type"
                options={[
                  "College ID card",
                  "Voter ID card",
                  "Aadhar card",
                  "Pan Card",
                ]}
              />
              <Input
                type="text"
                name="idCard_number"
                placeholder="Enter Identification Proof Number"
                className="!p-2"
              />
              <div className="flex items-center justify-between border border-gray-400 bg-secondray p-4 rounded-lg">
                <Typography>Take a picture of the ID Proof</Typography>
                <Button
                  type="button"
                  variant="icon"
                  className="ring-1 ring-third-500"
                  onClick={() => (uploadPopup.value = true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-14 h-14 fill-third-600"
                  >
                    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                    <path
                      fill-rule="evenodd"
                      d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          ))}

        <div className="flex items-center justify-center my-4">
          <Button
            type="button"
            variant="icon"
            className="gap-2 text-third-600 border ring-2 ring-third-600"
            onClick={() => (numberOfIds.value = numberOfIds.value + 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6  stroke-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add more Ids
          </Button>
        </div>

        <div className="flex items-center justify-between border border-gray-400 bg-secondray p-4 rounded-lg">
          <Typography>Take a picture of the User</Typography>
          <Button
            type="button"
            variant="icon"
            className="ring-1 ring-third-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-14 h-14 fill-third-600"
            >
              <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
              <path
                fill-rule="evenodd"
                d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clip-rule="evenodd"
              />
            </svg>
          </Button>
        </div>
        <div className="w-full flex justify-end items-center my-4">
          <Button type="submit">Next</Button>
        </div>
      </FormControl>

      {isLoading.value === "idCard:upload" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : (
        <FileUploadPopup
          isPopup={uploadPopup}
          selectedFile={selectedFile}
          formRef={uploadFormRef}
          actionText="Upload"
          acceptFileType="image/png, image/jpeg"
          errorMessage={errorMessage}
          handlePopupAction={handleUploadIdCard}
        />
      )}
    </div>
  );
};

export default UserBiometricInfo;
