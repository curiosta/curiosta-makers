import { adminCreateBatchJobs } from "@/api/admin/product/createBatchJob";
import { adminGetBatchJobs } from "@/api/admin/product/getBatchjob";
import { adminGetDownloadLink } from "@/api/admin/product/getDownloadLink";
import { adminUploadFile } from "@/api/admin/product/uploadFile";
import Button from "@/components/Button";
import FileInput from "@/components/FileInput";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Typography from "@/components/Typography";
import { BatchJob } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";

type TLoadableOptions = "product:import" | "product:export";

const Inbound = () => {
  const selectedFile = useSignal<File | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const errorMessage = useSignal<string | null>(null);
  const isBatchJobComplete = useSignal<boolean>(false);
  const downloadLink = useSignal<string | null>(null);
  const batchjobId = useSignal<string | null>(null);
  const batchJob = useSignal<BatchJob | null>(null);

  const hanldeUpload = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading.value = "product:import";
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (selectedFile.value.type !== "text/csv") {
        return (errorMessage.value = "Only .csv file acceptable!");
      }
      const uploadRes = await adminUploadFile(selectedFile.value);
      const key = uploadRes.uploads[0].key;
      const createBatchRes = await adminCreateBatchJobs({
        type: "product-import",
        fileKey: key,
      });

      // call get batchjob with above batch id in interval
      const interval = setInterval(async () => {
        const getBatchRes = await adminGetBatchJobs({
          batchJobId: createBatchRes?.batch_job.id,
        });
        // batch job status is equal to completed or failed, clear interval
        if (
          getBatchRes?.batch_job?.status === "completed" ||
          getBatchRes?.batch_job?.status === "failed"
        ) {
          clearInterval(interval);
          isLoading.value = undefined;
        }
        batchJob.value = getBatchRes?.batch_job;

        if (getBatchRes?.batch_job?.result?.errors?.length) {
          return (errorMessage.value =
            getBatchRes?.batch_job?.result?.errors?.at(0));
        } else if (getBatchRes?.batch_job?.status === "completed") {
          isBatchJobComplete.value = true;
        }
      }, 2000);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      selectedFile.value = null;
    }
  };

  const handleExport = async () => {
    isLoading.value = "product:export";
    try {
      const res = await adminCreateBatchJobs({ type: "product-export" });
      batchjobId.value = res?.batch_job.id;

      // call get batchjob with above batch id in interval to geting export download link
      const interval = setInterval(() => {
        if (downloadLink.value && isLoading.value !== "product:export") {
          clearInterval(interval);
        }
        getBatchjob();
      }, 2000);
    } catch (error) {}
  };

  const getBatchjob = async () => {
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (!batchjobId.value) return;
      const res = await adminGetBatchJobs({ batchJobId: batchjobId.value });
      if (res?.batch_job?.status === "completed") {
        const downloadLinkRes = await adminGetDownloadLink({
          file_key: res?.batch_job?.result.file_key,
        });
        downloadLink.value = downloadLinkRes.download_url;
        isLoading.value = undefined;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        isLoading.value = undefined;
        errorMessage.value = error.message;
      }
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4 items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Inbound Items</Typography>
      </div>
      <div className="w-full flex flex-col justify-center gap-10 items-center max-w-xs mt-8">
        <form
          className="w-full flex flex-col items-center justify-center gap-4"
          onSubmit={hanldeUpload}
        >
          <FileInput selectedFile={selectedFile} acceptFileType=".csv" />
          <a
            className="flex gap-2 items-center text-app-primary-800 underline"
            href="https://curiosta-assets.s3.ap-south-1.amazonaws.com/Makers-product-template-1694177923301.csv"
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

        <div className="mb-28 flex flex-col items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            onClick={handleExport}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Export existing products
          </Button>

          {!downloadLink.value && isLoading.value === "product:export" ? (
            <Loading loadingText="Generating downloding link" />
          ) : downloadLink.value ? (
            <a
              className="flex gap-2 items-center text-secondray bg-primary-600 rounded-xl p-3 "
              href={downloadLink.value}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>{" "}
              Download
            </a>
          ) : null}
        </div>
        {errorMessage.value && batchjobId.value ? (
          <Typography variant="error">{errorMessage.value}</Typography>
        ) : null}
      </div>
      {isLoading.value === "product:import" && !isBatchJobComplete.value ? (
        <LoadingPopUp loadingText="please wait" />
      ) : (
        <PopUp
          title="File upload successfully"
          subtitle={`Batch ID: ${batchJob.value?.id}`}
          isPopup={isBatchJobComplete}
        />
      )}
      <BottomNavbar />
    </div>
  );
};

export default Inbound;
