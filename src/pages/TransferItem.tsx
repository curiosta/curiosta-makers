import { adminExportGsheets } from "@/api/admin/product/exportGsheets";
import { adminGsheetsSyncCategory } from "@/api/admin/product/gSheetsSyncCategory";
import { adminGsheetsSyncLocation } from "@/api/admin/product/gSheetsSyncLoaction";
import { adminImportGsheets } from "@/api/admin/product/importGsheets";
import { adminGetGsheetsLink } from "@/api/admin/product/gsheetsLink";
import Button from "@/components/Button";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Typography from "@/components/Typography";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
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
  const isImportQueued = useSignal<boolean>(false);
  const sheetUrl = useSignal<string | null>(null);

  useEffect(() => {
    // The sheet ID lives on the server now (it used to be baked into the build).
    adminGetGsheetsLink()
      .then((url) => (sheetUrl.value = url))
      .catch(() => (sheetUrl.value = null));
  }, []);

  const handleGsheetsImport = async () => {
    isLoading.value = true;
    isPopup.value = false;
    try {
      errorMessage.value = null;
      const result = await adminImportGsheets();
      isImportQueued.value = result.queued;
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
      errorMessage.value = null;
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
      errorMessage.value = null;
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
      errorMessage.value = null;
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
        <Typography size="h6/normal">Transfer Item</Typography>
      </div>

      <div className="flex flex-col gap-4 mt-4 mb-28">
        <Link
          href="/import-export-csv"
          className="flex justify-center items-center p-3  bg-primary-700 text-secondary rounded-md"
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
            Sync Platform Data
          </Button>
          <Button
            type="button"
            className="!w-full"
            onClick={() => {
              (isPopup.value = true), (isActiveTask.value = "Gsheets:export");
            }}
          >
            Sync Google Sheet
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

        {sheetUrl.value ? (
        <Link
          href={sheetUrl.value}
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
        ) : null}
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
        subtitle={`This action will update ${
          isActiveTask.value !== "Gsheets:import" ? "google sheet" : "platform"
        } data`}
      />

      <PopUp
        isPopup={isSuccessPopup}
        title={
          isActiveTask.value === "Gsheets:import"
            ? isImportQueued.value
              ? "Import started"
              : "Importing finished"
            : isActiveTask.value === "Gsheets:export"
            ? "Exporting finished"
            : "Google sheets updated successfully!"
        }
        subtitle={
          isActiveTask.value === "Gsheets:import"
            ? isImportQueued.value
              ? "This is a large sheet, so it is being imported in the background. Products will appear over the next few minutes."
              : "Products have been created/updated"
            : "You can check google sheets"
        }
      />

      <BottomNavbar />
    </div>
  );
};

export default TransferItem;
