import { isUser } from "@/store/userState";
import Button from "@components/Button";
import Typography from "@components/Typography";
import type { Order, Return } from "@medusajs/medusa";
import type { FunctionComponent } from "preact";
import Chip from "@components/Chip";
import { Link } from "preact-router";

type TOrderItemProps = {
  order?: Order;
  returnVal?: Return;
  page: "orders" | "home" | "return" | "adminReturn";
};
const OrderItem: FunctionComponent<TOrderItemProps> = ({
  order,
  page,
  returnVal,
}) => {
  const borrowItems = order?.items?.filter(
    (item) => item.metadata?.cartType === "borrow"
  );

  return (
    <div
      class={`border-b border-t border-gray-200 ${
        returnVal?.status === "received" ||
        (page === "return" && !borrowItems.length)
          ? "bg-gray-200/80"
          : "bg-secondray"
      } shadow-sm rounded-lg border`}
    >
      <div
        class={`flex items-center border-b p-4 ${
          returnVal?.status === "received" ||
          (page === "return" && !borrowItems.length)
            ? "border-gray-400"
            : "border-gray-200"
        }`}
      >
        <dl class="grid flex-1 grid-cols-2 gap-x-6 text-sm ">
          {page !== "adminReturn" && page !== "return" ? (
            <div>
              <dt class="font-medium text-gray-900">Order number</dt>
              <dd class="mt-1 text-gray-700 truncate">{order.id}</dd>
            </div>
          ) : (
            <div>
              <dt class="font-medium text-gray-900">Return number</dt>
              <dd class="mt-1 text-gray-700 truncate">
                {page === "adminReturn"
                  ? returnVal?.id
                  : order.returns?.length
                  ? order.returns?.at(0)?.id
                  : "N/A"}
              </dd>
            </div>
          )}
          <div>
            <dt class="font-medium text-gray-900">Requested date</dt>
            <dd class="mt-1 text-gray-700">
              <time dateTime="2021-07-06">
                {page !== "adminReturn" && page !== "return"
                  ? new Date(order.created_at).toLocaleDateString("default", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : page === "adminReturn"
                  ? new Date(returnVal.created_at).toLocaleDateString(
                      "default",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : page === "return" && order.returns?.length
                  ? new Date(
                      order.returns?.at(0)?.created_at
                    ).toLocaleDateString("default", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </time>
            </dd>
          </div>
        </dl>
      </div>

      {!isUser.value ? (
        <div
          className={`flex justify-between items-center px-4 py-2 border-b ${
            returnVal?.status === "received"
              ? "border-gray-400"
              : "border-gray-200"
          }`}
        >
          <Link
            href={
              page !== "adminReturn"
                ? `/user/${order?.customer_id}`
                : `/user/${returnVal?.order?.customer_id}`
            }
            className="flex items-center gap-3"
          >
            <Chip
              variant="primary2"
              className="!bg-primary-700 !rounded-full uppercase h-10 w-10 !text-white"
            >
              {page !== "adminReturn"
                ? order?.email.charAt(0)
                : returnVal?.order.email.charAt(0)}
            </Chip>
            <Typography size="body2/normal" className="truncate w-36">
              {page !== "adminReturn" ? order?.email : returnVal?.order.email}
            </Typography>
          </Link>

          <Button
            link={
              page !== "adminReturn"
                ? `/orders/${order.id}`
                : returnVal?.status === "received"
                ? `/orders/${returnVal?.order?.id}`
                : `/return/${returnVal?.order.id}/${returnVal?.id}`
            }
          >
            View
          </Button>
        </div>
      ) : null}

      {/* <!-- Products --> */}
      <Typography tag="h4" className="sr-only">
        Items
      </Typography>
      <ul role="list" class="divide-y divide-gray-200">
        {page !== "adminReturn"
          ? order.items.slice(0, 3).map((item) => (
              <li class="p-4 sm:p-6">
                <div class="flex items-center sm:items-start">
                  <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                    <img
                      src={item.thumbnail ?? "/images/placeholderImg.svg"}
                      alt={item.title}
                      class="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div class="ml-6 flex-1 text-sm">
                    <Typography
                      variant="secondary"
                      className="my-2 truncate w-40"
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="secondary">
                      Qty: {item.quantity}
                    </Typography>
                    <Typography variant="secondary">
                      order Type: {item.metadata?.cartType}
                    </Typography>
                  </div>
                </div>
              </li>
            ))
          : null}
      </ul>

      <div class={`p-4 ${order?.items?.length - 3 > 0 ? "block" : "hidden"}`}>
        <Typography size="body2/normal" variant="secondary">{`+ ${
          order?.items.length - 3
        } more item${order?.items.length - 3 > 1 ? "s" : ""}`}</Typography>
      </div>
      {page === "return" && !borrowItems.length ? (
        <Typography variant="error" className="text-center my-2">
          Can't return item from this order
        </Typography>
      ) : null}
      {isUser.value ? (
        <div
          className={`flex justify-center items-center  gap-4 p-4 border-t ${
            page === "return" && !borrowItems.length
              ? "border-gray-400"
              : "border-gray-200"
          }`}
        >
          <Button link={`/orders/${order?.id}`}>View Details</Button>
          {page === "return" && borrowItems.length ? (
            <Button
              link={`/return/${order?.id}`}
              variant="secondary"
              className="!py-3 disabled:bg-gray-200 disabled:text-gray-500 disabled:!border-none"
              disabled={order?.returns?.length >= 1}
            >
              Return
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center  gap-2 p-4 border-t">
          <Typography size="body1/normal" className="ml-2 capitalize ">
            Status:{" "}
            {page !== "adminReturn"
              ? order?.payment_status === "captured"
                ? order?.returns?.length
                  ? order?.returns?.at(0).status === "received"
                    ? "return completed"
                    : order?.returns?.at(0).status === "requested"
                    ? "return requested"
                    : order?.returns?.at(0).status
                  : order?.fulfillment_status
                : order?.payment_status === "awaiting"
                ? "Pending Approval"
                : order?.payment_status
              : returnVal?.status === "received"
              ? "return completed"
              : returnVal?.status === "requested"
              ? "return requested"
              : returnVal?.status}
          </Typography>
          {page === "adminReturn" && returnVal?.status === "received" ? (
            <svg
              class="h-5 w-5 text-app-primary-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default OrderItem;
