import Button from "@components/Button";
import { Signal } from "@preact/signals";
import type { FunctionComponent } from "preact";

type TOffsetPagination = {
  limit: Signal<number>;
  count: Signal<number>;
  offset: Signal<number>;
};

const index: FunctionComponent<TOffsetPagination> = ({
  limit,
  offset,
  count,
}) => {
  const isEndResult = offset.value + limit.value >= count.value;
  const prvBtnDisabled = offset.value <= 0;
  const nextBtnDisabled = isEndResult;

  const hidePagination = count.value <= limit.value;

  return (
    <div
      class={`${
        hidePagination ? "hidden" : "flex"
      } items-center justify-between border-t border-gray-200 mt-12 py-3 sm:px-6`}
      aria-label="Pagination"
    >
      <div class="hidden sm:block">
        <p class="text-sm text-gray-700 flex gap-1">
          Showing
          <span class="font-medium">{offset.value + 1}</span>-
          <span class="font-medium">
            {isEndResult ? count : offset.value + limit.value || 0}
          </span>
          of
          <span class="font-medium">{count.value || 0}</span>
          results
        </p>
      </div>
      <div class="flex flex-1 justify-between sm:justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          className={`!w-fit !px-3 !py-2 !bg-white ${
            prvBtnDisabled ? "hidden" : "inline-flex"
          }`}
          onClick={() =>
            (offset.value =
              offset.value > 0 ? Math.max(0, offset.value - limit.value) : 0)
          }
          disabled={prvBtnDisabled}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          className={`!w-fit !px-3 !py-2 !bg-white ${
            isEndResult ? "hidden" : "inline-flex"
          }`}
          onClick={() =>
            (offset.value =
              offset.value + limit.value < count.value
                ? Math.min(
                    offset.value + limit.value,
                    count.value * limit.value
                  )
                : count.value - 1)
          }
          disabled={nextBtnDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default index;
