import { adminExportGsheets } from "@/api/admin/product/exportGsheets";
import { adminGsheetsSyncCategory } from "@/api/admin/product/gSheetsSyncCategory";
import { adminGsheetsSyncLocation } from "@/api/admin/product/gSheetsSyncLoaction";
import { adminImportGsheets } from "@/api/admin/product/importGsheets";
import Button from "@/components/Button";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Typography from "@/components/Typography";
import { useSignal } from "@preact/signals";
import { Link } from "preact-router";

type TActiveOptions =
  | "Gsheets:import"
  | "Gsheets:export"
  | "Gsheets:syncLocation"
  | "Gsheets:syncCategory";

const TransferItem = () => {
  const isLoading = useSignal<boolean>(false);
  const errorMessage = useSignal<string | null>(null);
  const isPopup = useSignal<boolean>(false);
  const isActiveTask = useSignal<TActiveOptions | undefined>(undefined);
  const isSuccessPopup = useSignal<boolean>(false);

  const handleGsheetsImport = async () => {
    isLoading.value = true;
    isPopup.value = false;
    try {
      await adminImportGsheets();
      isSuccessPopup.value = true;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const handleGsheetsExport = async () => {
    isLoading.value = true;
    isPopup.value = false;
    try {
      await adminExportGsheets();
      isSuccessPopup.value = true;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };
  const handleSyncLoaction = async () => {
    isLoading.value = true;
    isPopup.value = false;
    try {
      await adminGsheetsSyncLocation();
      isSuccessPopup.value = true;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };
  const handleSyncCategory = async () => {
    isLoading.value = true;
    isPopup.value = false;
    try {
      await adminGsheetsSyncCategory();
      isSuccessPopup.value = true;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Item transfer</Typography>
      </div>

      <div className="flex flex-col gap-4 mt-4 mb-28">
        <Link
          href="/import-export-csv"
          className="flex justify-center items-center p-3  bg-primary-700 text-secondray rounded-md"
        >
          <Typography size="body2/semi-bold" className="text-center">
            Import/Export from CSV
          </Typography>
        </Link>
        <span className="border my-4"></span>
        {errorMessage.value ? (
          <Typography
            variant="error"
            className="text-center my-2 whitespace-break-spaces"
          >
            {errorMessage.value}
          </Typography>
        ) : null}
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            className="!w-full"
            onClick={() => {
              (isPopup.value = true), (isActiveTask.value = "Gsheets:import");
            }}
          >
            Import from google sheet
          </Button>
          <Button
            type="button"
            className="!w-full"
            onClick={() => {
              (isPopup.value = true), (isActiveTask.value = "Gsheets:export");
            }}
          >
            Export to google sheet
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={() => {
              (isPopup.value = true),
                (isActiveTask.value = "Gsheets:syncLocation");
            }}
          >
            Sync Locations
          </Button>
          <Button
            type="button"
            onClick={() => {
              (isPopup.value = true),
                (isActiveTask.value = "Gsheets:syncCategory");
            }}
          >
            Sync Categories
          </Button>
        </div>

        <Link
          href={`https://docs.google.com/spreadsheets/d/${
            import.meta.env.VITE_PRIVATE_GSHEETS_ID
          }/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center gap-2 items-center text-app-primary-700 my-6"
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
          View/Edit Google Sheet
        </Link>
      </div>

      {isLoading.value ? (
        <LoadingPopUp
          loadingText={
            isActiveTask.value === "Gsheets:import"
              ? "Please wait,this may take a while"
              : "Please wait"
          }
        />
      ) : null}

      <PopUp
        isPopup={isPopup}
        actionText="Yes, Confirm"
        handlePopupAction={
          isActiveTask.value === "Gsheets:import"
            ? handleGsheetsImport
            : isActiveTask.value === "Gsheets:export"
            ? handleGsheetsExport
            : isActiveTask.value === "Gsheets:syncLocation"
            ? handleSyncLoaction
            : handleSyncCategory
        }
        title="Are you sure and want to perform this action?"
        subtitle="This action will delete/update database data"
      />

      <PopUp
        isPopup={isSuccessPopup}
        title={
          isActiveTask.value === "Gsheets:import"
            ? "Importing finished"
            : isActiveTask.value === "Gsheets:export"
            ? "Exporting finished"
            : "Google sheets updated successfully!"
        }
        subtitle={
          isActiveTask.value === "Gsheets:import"
            ? "Products have been created/updated"
            : "You can check google sheets"
        }
      />

      <BottomNavbar />
    </div>
  );
};

export default TransferItem;
