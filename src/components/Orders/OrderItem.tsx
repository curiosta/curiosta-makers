import { isUser } from "@/store/userState";
import Button from "@components/Button";
import Typography from "@components/Typography";
import type { Order, Return } from "@medusajs/medusa";
import type { FunctionComponent } from "preact";
import Chip from "@components/Chip";

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
          ? "bg-gray-200/50"
          : "bg-secondray"
      } shadow-sm rounded-lg border`}
    >
      <div class="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
        <dl class="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
          {page !== "adminReturn" && page !== "return" ? (
            <div>
              <dt class="font-medium text-gray-900">Order number</dt>
              <dd class="mt-1 text-gray-500 truncate">{order.id}</dd>
            </div>
          ) : (
            <div>
              <dt class="font-medium text-gray-900">Return number</dt>
              <dd class="mt-1 text-gray-500 truncate">
                {page === "adminReturn"
                  ? returnVal?.id
                  : order.returns?.length
                  ? order.returns?.at(0)?.id
                  : "N/A"}
              </dd>
            </div>
          )}
          <div class="block">
            <dt class="font-medium text-gray-900">Requested date</dt>
            <dd class="mt-1 text-gray-500">
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
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <div className="flex items-center gap-3">
            <Chip className="!bg-primary-700 uppercase text-white">
              {page !== "adminReturn"
                ? order?.email.charAt(0)
                : returnVal?.order.email.charAt(0)}
            </Chip>
            <Typography
              size="body2/normal"
              variant="secondary"
              className="truncate w-36"
            >
              {page !== "adminReturn" ? order?.email : returnVal?.order.email}
            </Typography>
          </div>

          <Button
            link={
              page !== "adminReturn"
                ? `/orders/${order.id}`
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
          : returnVal?.items.map((returnItem) => (
              <li class="p-4 sm:p-6">
                <div class="flex items-center sm:items-start">
                  <div class="h-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                    <img
                      src={"/images/placeholderImg.svg"}
                      alt={"product"}
                      class="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div class="ml-6 flex-1 text-sm">
                    <Typography variant="secondary" className="my-2 break-all">
                      item_id: {returnItem.item_id}
                    </Typography>
                    <Typography variant="secondary">
                      Qty: {returnItem.requested_quantity}
                    </Typography>
                    <Typography variant="secondary">
                      order Type: {returnItem.metadata?.cartType}
                    </Typography>
                  </div>
                </div>
              </li>
            ))}
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
        <div className="flex justify-center items-center  gap-4 p-4 border-t">
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
        <div className="flex items-center  gap-4 p-4 border-t">
          <Typography size="body1/normal" variant="secondary" className="ml-2 ">
            Status:{" "}
            {page !== "adminReturn"
              ? order?.fulfillment_status
              : returnVal?.status}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
