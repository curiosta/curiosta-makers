import { Item, Order } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import TopNavbar from "@components/Navbar/TopNavbar";
import Typography from "@components/Typography";
import Loading from "@components/Loading";
import BottomNavbar from "@components/Navbar/BottomNavbar";
import { isUser } from "@/store/userState";
import { adminGetOrders } from "@/api/admin/orders/getOrder";
import Button from "@components/Button";
import PopUp from "@components/Popup";
import Progressbar from "@components/Progressbar";
import { adminCancelOrder } from "@/api/admin/orders/cancelOrder";
import LoadingPopUp from "@components/Popup/LoadingPopUp";
import { adminPaymentCapture } from "@/api/admin/orders/paymentCapture";
import { adminUpdateOrder } from "@/api/admin/orders/updateOrder";
import { ordersList } from "@/api/user/orders/ordersList";
import { Link } from "preact-router";
import AddressCard from "../AddressList/AddressCard";
import Chip from "../Chip";
import { adminGetProtectedUploadFile } from "@/api/admin/upload/getProtectedUpload";
import { TCustomer } from "@/api/user";

interface Props {
  id: string;
}
type TLoadableOptions =
  | "order:get"
  | "order:approve"
  | "order:cancel"
  | "user:profileImage";

const OrderInfo = ({ id }: Props) => {
  const order = useSignal<Order | null>(null);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const isPopup = useSignal<boolean>(false);
  const profileImageUrl = useSignal<string | null>(null);

  const getOrderInfo = async () => {
    isLoading.value = "order:get";
    try {
      const res = isUser.value
        ? await ordersList({ id, limit: 0, offset: 0 })
        : await adminGetOrders(id);
      order.value = isUser.value ? res?.orders?.at(0) : res?.order;
      if (!isUser.value) {
        if (!res?.order?.customer?.metadata?.profile_image_key) return;
        const { profile_image_key } = (order.value?.customer as TCustomer)
          ?.metadata;
        const profileImageUploadRes = await adminGetProtectedUploadFile({
          file_key: profile_image_key,
        });
        profileImageUrl.value = profileImageUploadRes?.download_url;
      }
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    getOrderInfo();
  }, [id]);

  // filter out fulfilled and not fulfilled items
  const fulfilledItemId = order.value?.fulfillments?.flatMap((fulfill) =>
    fulfill.items.map((item) => item.item_id)
  );

  const fulfilledItem = order.value?.items.filter((item) =>
    fulfilledItemId?.includes(item.id)
  );

  // if item fulfilled then only it can return
  const borrowItemsFulfilled = fulfilledItem?.filter(
    (item) => item.metadata?.cartType === "borrow"
  );

  const notFulfilledItem = order.value?.items.filter(
    (item) => !fulfilledItemId?.includes(item.id)
  );

  const returnItemIds = order.value?.returns
    ?.at(0)
    ?.items?.flatMap((item) => item.item_id);

  const hanldeApprove = async () => {
    isLoading.value = "order:approve";
    try {
      await adminUpdateOrder({ orderId: id, regionId: order.value?.region_id });
      const payment = await adminPaymentCapture(id);
      order.value = payment?.order;
      isPopup.value = true;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  const hanldeReject = async () => {
    isLoading.value = "order:cancel";
    try {
      const res = await adminCancelOrder(id);
      order.value = res?.order;
    } catch (error) {
    } finally {
      isLoading.value = undefined;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Order info</Typography>
      </div>
      <div className="w-full flex flex-col gap-4 mb-12 max-w-2xl">
        {isLoading.value !== "order:get" ? (
          <div className="w-full">
            <div className="my-2">
              <Typography size="small/normal" variant="secondary">
                Requested-{" "}
                {new Date(order.value?.created_at).toLocaleString("en-US", {
                  timeStyle: "medium",
                  dateStyle: "medium",
                })}
              </Typography>
              <Typography size="body1/normal">
                Order ID:{" "}
                {order.value?.id.substring(order.value?.id.length - 5)}
              </Typography>

              {!isUser.value ? (
                <div className="flex justify-between items-center px-2 py-2 shadow-sm border rounded-lg my-2">
                  <div className="flex items-center gap-3">
                    {order.value?.customer?.metadata?.profile_image_key ? (
                      <img
                        src={
                          profileImageUrl.value ?? "/images/placeholderImg.svg"
                        }
                        alt="profile"
                        className="object-fit h-10 w-10 border rounded-full shadow"
                      />
                    ) : (
                      <Chip
                        variant="primary2"
                        className="!bg-primary-700 !rounded-full uppercase h-10 w-10 !text-white"
                      >
                        {order.value?.email.charAt(0)}
                      </Chip>
                    )}
                    <Typography
                      size="body2/normal"
                      className="truncate w-36 max-[321px]:w-28 sm:w-96"
                    >
                      {order.value?.customer?.first_name}{" "}
                      {order.value?.customer?.last_name}
                    </Typography>
                  </div>
                  <Button
                    link={`/user/${order.value?.customer_id}`}
                    className="!px-3 capitalize"
                  >
                    View profile
                  </Button>
                </div>
              ) : null}

              <Progressbar
                status={
                  order.value?.payment_status === "captured"
                    ? order.value?.returns?.length
                      ? order.value?.returns?.at(0).status
                      : order.value?.fulfillment_status
                    : order.value?.payment_status
                }
              />
            </div>

            <div className="flex justify-between p-2 px-8 shadow rounded-lg w-full bg-secondary">
              <Typography size="h6/normal">Items</Typography>
              <Typography size="h6/normal">Requested Qty</Typography>
            </div>

            {order.value?.fulfillment_status === "partially_fulfilled" ||
            order.value?.fulfillment_status === "partially_returned" ||
            order.value?.fulfillment_status === "returned" ? (
              <div className="my-4">
                <Typography
                  size="body1/normal"
                  className="capitalize w-fit p-2 rounded-tl-2xl rounded-br-2xl bg-blue-600 text-white"
                >
                  Fulfilled
                </Typography>
                {fulfilledItem?.map((item) => (
                  <div className="flex justify-between items-center my-3 py-2 border-b last:border-none">
                    <div>
                      <Link
                        href={`/product/${item?.variant?.product_id}`}
                        className="flex gap-2 items-center"
                      >
                        <img
                          src={item.thumbnail ?? "/images/placeholderImg.svg"}
                          alt={item.title}
                          className="w-10 h-10 object-cover"
                        />
                        <Typography
                          size="body1/normal"
                          className="text-start truncate w-56"
                        >
                          {item.title}
                        </Typography>
                      </Link>
                      <Typography
                        size="body2/normal"
                        variant="secondary"
                        className="lowercase"
                      >
                        order Type: {item.metadata?.cartType}
                      </Typography>
                      {!item.returned_quantity ? (
                        <Typography size="body2/normal" className="lowercase">
                          fulfilled Qty: {item.fulfilled_quantity}
                        </Typography>
                      ) : (
                        <Typography size="body2/normal">
                          returned Qty: {item.returned_quantity}
                        </Typography>
                      )}
                      {returnItemIds && returnItemIds.includes(item.id) ? (
                        <Typography size="body2/normal">
                          return_status:{" "}
                          {order.value.returns?.at(0).status === "received"
                            ? "returned"
                            : order.value.returns?.at(0).status}
                        </Typography>
                      ) : null}
                    </div>
                    <Typography className="pr-8">x{item.quantity}</Typography>
                  </div>
                ))}
              </div>
            ) : (
              order.value?.items?.map((item) => (
                <div className="flex justify-between items-center my-3 py-2 border-b last:border-none">
                  <div>
                    <Link
                      href={`/product/${item?.variant?.product_id}`}
                      className="flex gap-2 items-center"
                    >
                      <img
                        src={item.thumbnail ?? "/images/placeholderImg.svg"}
                        alt={item.title}
                        className="w-10 h-10 object-cover"
                      />
                      <Typography
                        size="body1/normal"
                        className="text-start truncate w-56"
                      >
                        {item.title}
                      </Typography>
                    </Link>
                    <Typography
                      size="body2/normal"
                      variant="secondary"
                      className="lowercase"
                    >
                      order Type: {item.metadata?.cartType}
                    </Typography>
                    {returnItemIds && returnItemIds.includes(item.id) ? (
                      <Typography size="body2/normal">
                        return_status:{" "}
                        {order.value.returns?.at(0).status === "received"
                          ? "returned"
                          : order.value.returns?.at(0).status}
                      </Typography>
                    ) : null}
                  </div>
                  <Typography className="pr-8">x{item.quantity}</Typography>
                </div>
              ))
            )}

            {notFulfilledItem?.length &&
            order.value?.fulfillment_status !== "canceled" &&
            order.value?.fulfillment_status !== "not_fulfilled" ? (
              <div className="my-4">
                <Typography
                  size="body1/normal"
                  className="capitalize w-fit p-2 rounded-tl-2xl rounded-br-2xl bg-yellow-900 text-white"
                >
                  Not Fullfilled
                </Typography>
                {notFulfilledItem?.map((item) => (
                  <div className="flex justify-between items-center my-3 py-2 border-b last:border-none">
                    <div>
                      <Link
                        href={`/product/${item?.variant?.product_id}`}
                        className="flex gap-2 items-center"
                      >
                        <img
                          src={item.thumbnail ?? "/images/placeholderImg.svg"}
                          alt={item.title}
                          className="w-10 h-10 object-cover"
                        />
                        <Typography
                          size="body1/normal"
                          className="text-start truncate w-56"
                        >
                          {item.title}
                        </Typography>
                      </Link>
                      <Typography
                        size="body2/normal"
                        variant="secondary"
                        className="lowercase"
                      >
                        order Type: {item.metadata?.cartType}
                      </Typography>
                    </div>
                    <Typography className="pr-8">x{item.quantity}</Typography>
                  </div>
                ))}
                {!isUser.value ? (
                  <div className="flex justify-center">
                    <Button link={`/pick-items/${order.value?.id}`}>
                      Start Picking
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}

            {isUser.value &&
            borrowItemsFulfilled?.length &&
            order.value?.returns?.at(0)?.status !== "requested" ? (
              <div className="w-full flex justify-center items-center my-4">
                <Button
                  link={`/return/${order.value?.id}`}
                  variant="secondary"
                  className="!py-3 capitalize disabled:bg-gray-200 disabled:text-gray-500 disabled:!border-none"
                  disabled={order.value?.returns?.length >= 1}
                >
                  Return Borrow item
                </Button>
              </div>
            ) : null}

            {!isUser.value ? (
              <div className="flex flex-col items-center gap-4 my-4">
                <Typography size="h6/semi-bold">Address</Typography>
                {order.value?.shipping_address ? (
                  <AddressCard
                    address={order.value?.shipping_address}
                    variant="order"
                  />
                ) : (
                  <Typography
                    size="body2/normal"
                    variant="error"
                    className="my-4 text-center"
                  >
                    Address not found
                  </Typography>
                )}
              </div>
            ) : null}
            {!isUser.value &&
            order.value?.fulfillment_status === "not_fulfilled" ? (
              order.value?.payment_status === "awaiting" ? (
                <div className="w-full flex items-center justify-evenly my-8">
                  <Button type="button" onClick={hanldeApprove}>
                    Approve
                  </Button>
                  <Button type="button" variant="danger" onClick={hanldeReject}>
                    Reject
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center my-8">
                  <Button link={`/pick-items/${order.value?.id}`}>
                    Start Picking
                  </Button>
                </div>
              )
            ) : null}
          </div>
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}
      </div>
      {isLoading.value === "order:cancel" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : null}
      {isLoading.value === "order:approve" ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : (
        <PopUp
          title="Request is approved and picking task is created successfully"
          subtitle={`Pick Task id ${order.value?.id}`}
          actionText="Start Picking"
          actionLink={`/pick-items/${order.value?.id}`}
          isPopup={isPopup}
        />
      )}
      <BottomNavbar />
    </div>
  );
};

export default OrderInfo;
