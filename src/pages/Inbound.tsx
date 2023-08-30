import { adminCreateBatchJobs } from "@/api/admin/product/createBatchJob";
import { adminUploadFile } from "@/api/admin/product/uploadFile";
import Button from "@/components/Button";
import FileInput from "@/components/FileInput";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Typography from "@/components/Typography";
import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";

const Inbound = () => {
  const selectedFile = useSignal<File | null>(null);
  const isLoading = useSignal<boolean>(false);
  const errorMessage = useSignal<string | null>(null);
  const isBatchJobComplete = useSignal<boolean>(false);

  const hanldeUpload = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = true;
    if (errorMessage.value) {
      errorMessage.value = null;
    }

    console.log(selectedFile.value);
    try {
      if (selectedFile.value.type !== "text/csv") {
        return (errorMessage.value = "Only .csv file acceptable!");
      }
      const uploadRes = await adminUploadFile(selectedFile.value);
      const key = uploadRes.uploads[0].key;
      await adminCreateBatchJobs({ fileKey: key });
      isBatchJobComplete.value = true;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
      selectedFile.value = null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Inbound Items</Typography>
      </div>
      <div className="w-full flex flex-col justify-center items-center max-w-xs mt-8">
        <form
          className="w-full flex flex-col items-center justify-center gap-4"
          onSubmit={hanldeUpload}
        >
          <FileInput selectedFile={selectedFile} acceptFileType=".csv" />
          <a
            className="flex gap-2 items-center text-app-primary-800 underline"
            href="https://curiosta-assets.s3.ap-south-1.amazonaws.com/makers_prouduct-1693309510162.csv"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M14 11V14H2V11H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V11H14ZM13 7L11.59 5.59L9 8.17V0H7V8.17L4.41 5.59L3 7L8 12L13 7Z"
                fill="black"
              />
            </svg>{" "}
            Get the template here!
          </a>
          <Button type="submit" disabled={selectedFile.value === null}>
            Proceed
          </Button>
          {errorMessage.value ? (
            <Typography variant="error">{errorMessage.value}</Typography>
          ) : null}
        </form>
      </div>
      {isLoading.value ? (
        <LoadingPopUp loadingText="please wait" />
      ) : (
        <PopUp
          title="File upload successfully"
          subtitle="Please check final status on medusa admin"
          isPopup={isBatchJobComplete}
        />
      )}
    </div>
  );
};

export default Inbound;
