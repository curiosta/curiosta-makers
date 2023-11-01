import { adminListRegion } from "@/api/admin/customers/listRegion";
import { adminCreateDraftOrder } from "@/api/admin/orders/createDraftOrder";
import { adminMarkPaidDraftOrder } from "@/api/admin/orders/markPaidDraftOrder";
import cart from "@/api/cart";
import user from "@/api/user";
import { listRegion } from "@/api/user/region/listRegion";
import AddressCard from "@/components/AddressList/AddressCard";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Loading from "@/components/Loading";
import ManageQty from "@/components/ManageQty";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Typography from "@/components/Typography";
import ViewCartLayer from "@/components/ViewCartLayer";
import {
  TDraftOrderItems,
  draftOrderItems,
  selectedUser,
} from "@/store/draftOrderStore";
import { isPopup } from "@/store/popUpState";
import { isUser } from "@/store/userState";
import PopUp from "@components/Popup";
import { LineItem, Order, Region } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { Link } from "preact-router";
import { ChangeEvent } from "preact/compat";

const Cart = () => {
  const cartIssuedItem = isUser.value
    ? cart.store.value?.items?.filter(
        (item) => item.metadata?.cartType === "issue"
      )
    : draftOrderItems.value?.filter(
        (item) => item.metadata?.cartType === "issue"
      );

  const cartBorrowItem = isUser.value
    ? cart.store.value?.items?.filter(
        (item) => item.metadata?.cartType === "borrow"
      )
    : draftOrderItems.value?.filter(
        (item) => item.metadata?.cartType === "borrow"
      );
  const cartLoading = cart.loading.value === "cart:get";

  // Return time period options
  const timePeriodOptions = [
    "I’ll return the items today",
    "I’ll return the items tomorrow",
    "I’ll return the items after a week",
    "Let me select a custom time window",
  ];

  const selectedDate = useSignal<string>("");
  const selectedDateLoading = useSignal<boolean>(false);
  const isCartCompletePopUp = useSignal<boolean>(false);
  const isCartDiscarding = useSignal<boolean>(false);
  const isCartComplete = useSignal<boolean>(false);
  const addressSelectPopUp = useSignal<boolean>(false);
  const draftOrderInfo = useSignal<Order | null>(null);
  const errorMessage = useSignal<string | undefined>(undefined);
  const userNotSelected = useSignal<boolean>(false);

  const handleSelectDate = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked, name } = e.currentTarget;

    if (checked && value !== "custom") {
      selectedDate.value = value;
    }
    if (name === "custom_date") {
      selectedDate.value = new Date(value).toDateString();
    }

    selectedDateLoading.value = true;
    cartBorrowItem.map(async (borrowItem: LineItem & TDraftOrderItems) => {
      try {
        if (!selectedDate.value) return;
        if (isUser.value) {
          await cart.removeItem(borrowItem.id);
          await cart.updateItemMetaData({
            variant_id: borrowItem.variant_id,
            quantity: borrowItem.quantity,
            metadata: {
              cartType: "borrow",
              borrowReturnDate: selectedDate.value ? selectedDate.value : null,
            },
          });
        } else {
          const updateItemMetaData = draftOrderItems.value?.map((item) =>
            item.variant_id === borrowItem.variant_id
              ? {
                  ...item,
                  metadata: {
                    cartType: "borrow",
                    borrowReturnDate: selectedDate.value
                      ? selectedDate.value
                      : null,
                  },
                }
              : item
          );
          draftOrderItems.value = updateItemMetaData;
        }
      } catch (error) {
        console.log(error);
      } finally {
        selectedDateLoading.value = false;
      }
    });
  };

  // handle cart complete
  const handleCartComplete = async () => {
    isCartComplete.value = true;
    if (errorMessage.value) {
      errorMessage.value = undefined;
    }
    try {
      if (isUser.value) {
        await cart.completeCart(cart.store.value.id);
      } else {
        if (!selectedUser.value) {
          return (userNotSelected.value = true);
        }
        const { email, billing_address, billing_address_id, id } =
          selectedUser.value;
        if (!billing_address_id) {
          isCartComplete.value = false;
          throw new Error(
            "This user don't have any default address!\n Ask user to add default address first."
          );
        }
        const regionRes = await adminListRegion();
        const regions: Region[] = regionRes?.regions;
        const countryCodes = billing_address.country_code;
        const regionId = regions?.find((region) =>
          countryCodes.includes(region.countries[0]?.iso_2)
        )?.id;

        const items = draftOrderItems.value.map((item) => {
          return {
            quantity: item.quantity,
            variant_id: item.variant_id,
            metadata: item.metadata,
          };
        });
        const draftOrderRes = await adminCreateDraftOrder({
          email: email,
          address: billing_address_id,
          items: items,
          region_id: regionId,
          customer_id: id,
        });
        const draftOrderId = draftOrderRes?.draft_order?.id;
        const markPaidRes = await adminMarkPaidDraftOrder(draftOrderId);
        draftOrderItems.value = [];
        selectedUser.value = null;
        draftOrderInfo.value = markPaidRes?.order;
      }
      isCartCompletePopUp.value = true;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorMessage.value = error.message;
        if (error.message.includes("Default address not found")) {
          addressSelectPopUp.value = true;
        }
      }
    } finally {
      isCartComplete.value = false;
    }
  };

  // discart cart
  const handleDiscard = async () => {
    isCartDiscarding.value = true;
    try {
      if (isUser.value) {
        await cart.resetCartId();
      } else {
        draftOrderItems.value = [];
        selectedUser.value = null;
      }
    } catch (error) {
      console.log(error);
    } finally {
      isCartDiscarding.value = false;
    }
  };

  // set draft order data on local storage
  localStorage.setItem(
    "draftOrderItems",
    JSON.stringify(draftOrderItems.value)
  );
  localStorage.setItem("draftUser", JSON.stringify(selectedUser.value));

  // cart item length
  const cartItemLength = isUser.value
    ? cart.store?.value?.items.length
    : draftOrderItems.value?.length;

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Cart</Typography>
      </div>
      <div className="w-full mb-12 max-w-2xl">
        {!cartLoading ? (
          cartItemLength ? (
            <div className="w-full my-2 mb-16">
              {!isUser.value && selectedUser.value ? (
                <div className="my-4">
                  <Typography size="body1/semi-bold" className="text-center">
                    Selected user
                  </Typography>
                  <div className="flex justify-between items-center px-4 py-2 shadow-sm border rounded-lg my-2">
                    <div className="flex items-center gap-3">
                      <Chip
                        variant="primary2"
                        className="!bg-primary-700 !rounded-full uppercase h-10 w-10 !text-white"
                      >
                        {selectedUser.value?.email.charAt(0)}
                      </Chip>
                      <Typography
                        size="body2/normal"
                        className="truncate w-36 sm:w-96"
                      >
                        {selectedUser.value?.email}
                      </Typography>
                    </div>
                    <Button
                      link={`/user/${selectedUser.value?.id}`}
                      className="!px-3"
                    >
                      View profile
                    </Button>
                  </div>
                  <div className="flex flex-col items-center gap-2 my-4">
                    <Typography size="body1/normal">Address</Typography>
                    {selectedUser.value?.billing_address ? (
                      <AddressCard
                        address={selectedUser.value?.billing_address}
                        variant="order"
                      />
                    ) : (
                      <Typography
                        size="body2/normal"
                        variant="error"
                        className="my-1 text-center"
                      >
                        Address not found
                      </Typography>
                    )}
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col gap-4">
                {cartIssuedItem?.length ? (
                  <div className={`${!cartBorrowItem.length ? "mb-8" : ""}`}>
                    <Typography
                      size="body1/normal"
                      className="capitalize w-fit p-2 rounded-tl-2xl rounded-br-2xl bg-blue-600 text-white"
                    >
                      Issues Requests
                    </Typography>
                    {cartIssuedItem?.map(
                      (product: LineItem & TDraftOrderItems, index) => (
                        <div className="flex justify-between items-center gap-4 my-3 py-2 border-b last:border-none relative">
                          <Link
                            href={`/product/${
                              isUser.value
                                ? product?.variant?.product?.id
                                : product.product_id
                            }`}
                            className="flex gap-2 w-1/2 z-10"
                          >
                            <img
                              src={
                                product.thumbnail ??
                                "/images/placeholderImg.svg"
                              }
                              alt={product.title}
                              className="w-8 h-8 object-cover"
                            />
                            <Typography
                              size="body1/normal"
                              className="text-start truncate w-44"
                            >
                              {product?.title}
                            </Typography>
                          </Link>
                          <ManageQty
                            productItem={product}
                            draftItem={product}
                            inventoryQty={product.inventoryQty}
                            page="cart"
                          />
                        </div>
                      )
                    )}
                  </div>
                ) : null}
                {cartBorrowItem?.length ? (
                  <div className="mb-8">
                    <div className="flex justify-between items-center">
                      <Typography
                        size="body1/normal"
                        className="capitalize w-fit p-2 rounded-tl-2xl rounded-br-2xl bg-yellow-800 text-white"
                      >
                        Borrow Requests
                      </Typography>
                      {cartBorrowItem[cartBorrowItem?.length - 1]?.metadata
                        ?.borrowReturnDate ? (
                        <Typography
                          size="small/normal"
                          className="w-1/2 sm:w-fit"
                        >
                          Expected Return Date:{" "}
                          {
                            cartBorrowItem[cartBorrowItem?.length - 1].metadata
                              ?.borrowReturnDate
                          }
                        </Typography>
                      ) : null}
                    </div>
                    {cartBorrowItem?.map(
                      (product: LineItem & TDraftOrderItems, index) => (
                        <div className="flex justify-between items-center gap-4 my-3 py-2 border-b last:border-none last:mb-20 relative">
                          <Link
                            href={`/product/${
                              isUser.value
                                ? product?.variant?.product?.id
                                : product.product_id
                            }`}
                            className="flex gap-2 w-1/2 z-10"
                          >
                            <img
                              src={
                                product.thumbnail ??
                                "/images/placeholderImg.svg"
                              }
                              alt={product.title}
                              className="w-8 h-8 object-cover"
                            />
                            <Typography
                              size="body1/normal"
                              className="text-start truncate w-44"
                            >
                              {product?.title}
                            </Typography>
                          </Link>
                          <ManageQty
                            productItem={product}
                            draftItem={product}
                            inventoryQty={product.inventoryQty}
                            page="cart"
                          />
                        </div>
                      )
                    )}
                  </div>
                ) : null}
              </div>
              {cartBorrowItem?.length &&
              !cartBorrowItem?.[cartBorrowItem?.length - 1]?.metadata
                ?.borrowReturnDate ? (
                <ViewCartLayer
                  actionText="Choose Period"
                  handleAction={() => (isPopup.value = true)}
                  borrowItems={cartBorrowItem?.length}
                />
              ) : (
                // confirm order or discard buttons
                <div className="fixed bottom-16 left-0 p-4 w-full z-10 bg-secondray border shadow-sm">
                  {errorMessage.value ? (
                    <Typography
                      variant="error"
                      className="text-center my-4 whitespace-break-spaces"
                    >
                      {errorMessage.value}
                    </Typography>
                  ) : null}
                  <div className="flex items-center justify-around w-full mx-auto max-w-2xl">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleCartComplete}
                      disabled={cart.loading.value === "cart:complete"}
                    >
                      Request
                    </Button>
                    <Button
                      link="/create-requests"
                      variant="icon"
                      className="!w-12 !h-12 items-center bg-primary-600/10  !rounded-full !p-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 stroke-primary-600"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      onClick={handleDiscard}
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Empty cart
            <div className="w-full h-full flex justify-center items-center px-8">
              <div className="flex flex-col items-center w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-28 fill-none stroke-gray-300"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                <Typography size="h5/medium" className="text-gray-400">
                  No items in cart!
                </Typography>
              </div>
            </div>
          )
        ) : (
          <div className="h-40">
            <Loading loadingText="loading" />
          </div>
        )}
        {isCartComplete.value ? (
          <LoadingPopUp loadingText="please wait" />
        ) : (
          <PopUp
            title="Request is placed successfully"
            subtitle={`Request ID: ${
              isUser.value
                ? cart.orderStore?.value?.data?.id
                : draftOrderInfo.value?.id
            }`}
            actionText="Check request"
            actionLink={`/orders/${
              isUser.value
                ? cart.orderStore.value?.data?.id
                : draftOrderInfo.value?.id
            }`}
            isPopup={isCartCompletePopUp}
          />
        )}
        <PopUp
          title="Please select a time window"
          actionText="Submit"
          isPopup={isPopup}
          handlePopupAction={handleSelectDate}
          formContents={timePeriodOptions}
          selectedDate={selectedDate}
          selectedDateLoading={selectedDateLoading}
        />

        {isCartDiscarding.value ? (
          <LoadingPopUp loadingText="Deleting please wait" />
        ) : null}

        <PopUp
          isPopup={addressSelectPopUp}
          actionText="Check Address"
          actionLink={`/user/${user.customer.value?.id}`}
          title="Default address not found!"
          subtitle="Please set a default address from address list before proceed request"
        />
        <PopUp
          isPopup={userNotSelected}
          actionText="Select user"
          actionLink={`/issue-inventory`}
          title="User not selected!"
          subtitle="Please select any user before proceed request"
        />
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Cart;
