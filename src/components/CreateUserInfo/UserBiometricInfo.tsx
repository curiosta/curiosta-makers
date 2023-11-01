import { Signal, useSignal } from "@preact/signals";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import Typography from "../Typography";
import { TDocumentInfo } from "@pages/CreateUser";
import LoadingPopUp from "../Popup/LoadingPopUp";
import FileUploadPopup from "../Popup/FileUploadPopup";
import { useRef } from "preact/hooks";
import { ChangeEvent } from "preact/compat";
import { adminProtectedUploadFile } from "@/api/admin/upload/protectedUploadFile";
import NewInput from "../Input/NewInput";

type TUserBiometricInfo = {
  documentInfo: Signal<TDocumentInfo>;
  profileImageKey: Signal<string>;
  activeStep: Signal<number>;
};
type TLoadableOptions = "profile:image:upload" | "idCard:upload";

const UserBiometricInfo = ({
  documentInfo,
  profileImageKey,
  activeStep,
}: TUserBiometricInfo) => {
  const numberOfIds = useSignal<number>(1);
  const selectedFile = useSignal<File | null>(null);
  const uploadPopup = useSignal<boolean>(false);
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const errorMessage = useSignal<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uploadType = useSignal<"idUpload" | "profileImageUpload" | null>(null);

  const handleUploadIdCard = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "idCard:upload";
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (!formRef.current) return;
      const formData = new FormData(formRef.current);
      const formDataObj = Object.fromEntries(formData.entries());
      const { idCard_type, idCard_number } = formDataObj;

      const idNumber = idCard_number.toString();
      const idType = idCard_type.toString();
      if (!idNumber) {
        throw Error("Please enter ID Card number!");
      } else if (idNumber.length < 3) {
        throw Error("Please enter valid ID Card number!");
      }
      const uploadRes = await adminProtectedUploadFile(selectedFile.value);
      const file_key: string = uploadRes?.uploads[0]?.key;
      documentInfo.value = [
        ...documentInfo.value,
        {
          idImageKey: file_key,
          idNumber: idNumber,
          idType: idType,
        },
      ];
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

  const handleUploadProfileImage = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "profile:image:upload";
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      const uploadRes = await adminProtectedUploadFile(selectedFile.value);
      const file_key: string = uploadRes?.uploads[0]?.key;
      profileImageKey.value = file_key;
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
      <form
        onSubmit={handleUploadIdCard}
        ref={formRef}
        className="flex flex-col gap-4"
      >
        {Array(numberOfIds.value)
          .fill(1)
          .map((val, index) => (
            <div className="flex flex-col gap-2.5">
              <Select
                name="idCard_type"
                options={[
                  "College ID card",
                  "Voter ID card",
                  "Aadhar card",
                  "Pan Card",
                ]}
                defaultValue={
                  documentInfo.value?.length &&
                  [
                    "College ID card",
                    "Voter ID card",
                    "Aadhar card",
                    "Pan Card",
                  ].find(
                    (idCard) =>
                      idCard.replaceAll(" ", "-").toLowerCase() ===
                      documentInfo.value
                        ?.at(index)
                        ?.idType.replaceAll(" ", "-")
                        .toLowerCase()
                  )
                }
              />

              <NewInput
                type="text"
                name="idCard_number"
                placeholder="Enter Identification Proof Number"
                className="!p-2"
                defaultValue={
                  documentInfo.value?.length
                    ? documentInfo.value?.at(index)?.idNumber
                    : ""
                }
              />
              <div className="flex items-center justify-between border border-gray-400 bg-secondray p-4 rounded-lg">
                <div>
                  <Typography>Take a picture of the ID Proof</Typography>
                  {documentInfo.value?.length &&
                  documentInfo.value?.at(index)?.idImageKey ? (
                    <div className="flex items-center gap-2 my-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-5 h-5 fill-primary-600"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <Typography size="body2/normal">
                        Picture of proof uploaded
                      </Typography>
                      <Button
                        type="button"
                        variant="icon"
                        className="!text-danger-600  gap-2 !items-center"
                        onClick={() =>
                          (documentInfo.value = documentInfo.value.filter(
                            (doc) =>
                              doc.idImageKey !==
                              documentInfo.value?.at(index)?.idImageKey
                          ))
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-5 h-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="icon"
                  className="ring-1 ring-third-500"
                  onClick={() => {
                    (uploadPopup.value = true), (uploadType.value = "idUpload");
                  }}
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
            Add more IDs
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between border border-gray-400 bg-secondray p-4 rounded-lg">
        <div>
          <Typography>Take a picture of the User</Typography>
          {profileImageKey.value ? (
            <div className="flex items-center gap-2 my-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5 fill-primary-600"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clip-rule="evenodd"
                />
              </svg>
              <Typography size="body2/normal">
                Profile image uploaded
              </Typography>
              <Button
                type="button"
                variant="icon"
                className="!text-danger-600  gap-2 !items-center"
                onClick={() => (profileImageKey.value = null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Delete
              </Button>
            </div>
          ) : null}
        </div>
        <Button
          type="button"
          variant="icon"
          className="ring-1 ring-third-500"
          onClick={() => {
            (uploadPopup.value = true),
              (uploadType.value = "profileImageUpload");
          }}
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
      <div className="w-full flex justify-between items-center my-4">
        <Button
          type="button"
          onClick={() => (activeStep.value = activeStep.value - 1)}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => (activeStep.value = activeStep.value + 1)}
        >
          Next
        </Button>
      </div>

      {isLoading.value === "idCard:upload" ||
      isLoading.value === "profile:image:upload" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : (
        <FileUploadPopup
          isPopup={uploadPopup}
          selectedFile={selectedFile}
          formRef={uploadFormRef}
          actionText="Upload"
          acceptFileType="image/png, image/jpeg"
          errorMessage={errorMessage}
          handlePopupAction={
            uploadType.value === "idUpload"
              ? handleUploadIdCard
              : handleUploadProfileImage
          }
        />
      )}
    </div>
  );
};

export default UserBiometricInfo;
