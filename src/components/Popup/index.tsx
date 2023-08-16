import Button from "@components/Button";
import Typography from "@components/Typography";
import Radio from "@components/Radio";
import Input from "@components/Input";
import { Signal, useSignal } from "@preact/signals";

type PopUp = {
  title: string;
  subtitle?: string;
  isPopup?: Signal<boolean>;
  actionText: string;
  actionLink?: string;
  formContents?: string[];
  handlePopupAction?: (e?: any) => void;
  selectedDate?: Signal<string>;
  selectedDateLoading?: Signal<boolean>;
};

const index = ({
  title,
  subtitle,
  isPopup,
  actionText,
  actionLink,
  formContents,
  handlePopupAction,
  selectedDateLoading,
}: PopUp) => {
  const isCustomDate = useSignal(false);

  // today date and future dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const week = new Date(today);
  week.setDate(today.getDate() + 7);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-10 backdrop-brightness-75 items-center justify-center ${
        isPopup.value ? "flex " : "hidden"
      }`}
    >
      {/* close on outside click */}
      {formContents ? (
        <div
          className="block w-full h-full"
          onClick={() =>
            !selectedDateLoading.value ? (isPopup.value = false) : null
          }
        />
      ) : (
        <div
          className="block w-full h-full"
          onClick={() => (isPopup.value = false)}
        />
      )}
      <div
        className={`absolute w-10/12 bg-secondray  rounded-2xl transition-all p-6`}
      >
        <div className="flex flex-col text-center gap-2 mb-4">
          <Typography className={formContents?.length ? "!font-semibold" : ""}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography className="break-words">{subtitle}</Typography>
          ) : null}
        </div>

        {formContents ? (
          <div className="flex flex-col gap-2">
            {formContents.map((content) => (
              <Radio
                name="time_period"
                label={content}
                value={
                  content.includes("today")
                    ? today.toDateString()
                    : content.includes("tomorrow")
                    ? tomorrow.toDateString()
                    : content.includes("week")
                    ? week.toDateString()
                    : "custom"
                }
                onChange={(e) => {
                  handlePopupAction(e);
                  e.currentTarget.value === "custom"
                    ? (isCustomDate.value = true)
                    : (isCustomDate.value = false);
                }}
              />
            ))}
            {isCustomDate.value ? (
              <Input
                type="date"
                name="custom_date"
                label="Select return date"
                onChange={handlePopupAction}
              />
            ) : null}
            <div className=" w-full flex items-center justify-center mt-2">
              <Button
                type="button"
                variant="danger"
                onClick={() => (isPopup.value = false)}
                className={"disabled:grayscale"}
                disabled={selectedDateLoading.value}
              >
                {selectedDateLoading.value ? "Please wait.." : "Closed"}
              </Button>
            </div>
          </div>
        ) : null}

        {!formContents?.length ? (
          <div className=" w-full flex items-center justify-evenly">
            {actionLink ? (
              <Button link={actionLink}>{actionText}</Button>
            ) : (
              <Button type="button" onClick={handlePopupAction}>
                {actionText}
              </Button>
            )}
            <Button
              type="button"
              variant="danger"
              onClick={() => (isPopup.value = false)}
            >
              Closed
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default index;
