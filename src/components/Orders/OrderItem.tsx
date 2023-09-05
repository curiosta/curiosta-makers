import { isUser } from "@/store/userState";
import Button from "@components/Button";
import Typography from "@components/Typography";
import type { Order } from "@medusajs/medusa";
import type { FunctionComponent } from "preact";
import Chip from "@components/Chip";

type TOrderItemProps = {
  order: Order;
  page: "orders" | "home" | "return" | "adminReturn";
};
const OrderItem: FunctionComponent<TOrderItemProps> = ({ order, page }) => {
  const borrowItems = order.items?.filter(
    (item) => item.metadata?.cartType === "borrow"
  );

  return (
    <div
      class={`border-b border-t border-gray-200 bg-white shadow-sm rounded-lg border ${
        page === "home" || page === "orders" ? "!block" : ""
      }  ${borrowItems?.length ? "block" : "hidden"}`}
    >
      <div class="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
        <dl class="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
          {page !== "adminReturn" ? (
            <div>
              <dt class="font-medium text-gray-900">Order number</dt>
              <dd class="mt-1 text-gray-500 truncate">{order.id}</dd>
            </div>
          ) : (
            <div>
              <dt class="font-medium text-gray-900">Return number</dt>
              <dd class="mt-1 text-gray-500 truncate">
                {order.returns?.at(0)?.id}
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
                  : order.returns?.length
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
              {order.email.charAt(0)}
            </Chip>
            <Typography size="body2/normal" variant="secondary">
              {order.email}
            </Typography>
          </div>

          <Button
            link={
              page !== "adminReturn"
                ? `/orders/${order.id}`
                : `/return/${order.id}/${order.returns?.at(0)?.id}`
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
        {page !== "return" && page !== "adminReturn"
          ? order.items.slice(0, 3).map((item) => (
              <li class="p-4 sm:p-6">
                <div class="flex items-center sm:items-start">
                  <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                    <img
                      src={item.thumbnail ?? undefined}
                      alt={item.title}
                      class="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div class="ml-6 flex-1 text-sm">
                    <Typography variant="secondary" className="my-2">
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
          : borrowItems?.slice(0, 3).map((item) => (
              <li class="p-4 sm:p-6">
                <div class="flex items-center sm:items-start">
                  <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                    <img
                      src={item.thumbnail ?? undefined}
                      alt={item.title}
                      class="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div class="ml-6 flex-1 text-sm">
                    <Typography variant="secondary" className="my-2">
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
            ))}
      </ul>
      <div class={`p-4 ${order.items.length - 3 > 0 ? "block" : "hidden"}`}>
        <Typography size="body2/normal" variant="secondary">{`+ ${
          order.items.length - 3
        } more item${order.items.length - 3 > 1 ? "s" : ""}`}</Typography>
      </div>
      {isUser.value ? (
        <div className="flex justify-center items-center  gap-4 p-4 border-t">
          <Button link={`/orders/${order.id}`}>View Details</Button>
          {page === "return" ? (
            <Button
              link={`/return/${order.id}`}
              variant="secondary"
              className="!py-3 disabled:bg-gray-200 disabled:text-gray-500 disabled:!border-none"
              disabled={order.fulfillment_status === "not_fulfilled"}
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
              ? order.fulfillment_status
              : order.returns?.at?.(0).status}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
