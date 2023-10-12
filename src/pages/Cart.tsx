import cart from "@/api/cart";
import user from "@/api/user";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ManageQty from "@/components/ManageQty";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import Typography from "@/components/Typography";
import ViewCartLayer from "@/components/ViewCartLayer";
import { isPopup } from "@/store/popUpState";
import PopUp from "@components/Popup";
import { useSignal } from "@preact/signals";
import { Link } from "preact-router";
import { ChangeEvent } from "preact/compat";

const Cart = () => {
  const cartIssuedItem = cart.store.value?.items?.filter(
    (item) => item.metadata?.cartType === "issue"
  );
  const cartBorrowItem = cart.store.value?.items?.filter(
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

  const handleSelectDate = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked, name } = e.currentTarget;

    if (checked && value !== "custom") {
      selectedDate.value = value;
    }
    if (name === "custom_date") {
      selectedDate.value = new Date(value).toDateString();
    }

    selectedDateLoading.value = true;
    cartBorrowItem.map(async (borrowItem) => {
      try {
        if (!selectedDate.value) return;
        await cart.removeItem(borrowItem.id);
        await cart.updateItemMetaData({
          variant_id: borrowItem.variant_id,
          quantity: borrowItem.quantity,
          metadata: {
            cartType: "borrow",
            borrowReturnDate: selectedDate.value ? selectedDate.value : null,
          },
        });
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
    try {
      await cart.completeCart(cart.store.value.id);
      isCartCompletePopUp.value = true;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
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
      await cart.resetCartId();
    } catch (error) {
      console.log(error);
    } finally {
      isCartDiscarding.value = false;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Cart</Typography>
      </div>

      {!cartLoading ? (
        cart.store?.value?.items.length ? (
          <div className="w-full my-2 mb-16">
            <div className="flex flex-col gap-4">
              {cartIssuedItem?.length ? (
                <div>
                  <Typography
                    size="body1/normal"
                    className="capitalize w-fit p-2 rounded-tl-2xl rounded-br-2xl bg-blue-600 text-white"
                  >
                    Issues Requests
                  </Typography>
                  {cartIssuedItem?.map((product, index) => (
                    <div
                      key={product?.id}
                      className="flex justify-between items-center gap-4 my-3 py-2 border-b last:border-none relative"
                    >
                      <Link
                        href={`/product/${product?.variant?.product?.id}`}
                        className="flex gap-2 w-1/2 z-10"
                      >
                        <img
                          src={
                            product.thumbnail ?? "/images/placeholderImg.svg"
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
                      <ManageQty productItem={product} page="cart" />
                    </div>
                  ))}
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
                    {cartBorrowItem[0]?.metadata?.borrowReturnDate ? (
                      <Typography size="small/normal" className="w-1/2">
                        Expected Return Date:{" "}
                        {cartBorrowItem[0].metadata?.borrowReturnDate}
                      </Typography>
                    ) : null}
                  </div>
                  {cartBorrowItem?.map((product, index) => (
                    <div
                      key={product?.id}
                      className="flex justify-between items-center gap-4 my-3 py-2 border-b last:border-none last:mb-20 relative"
                    >
                      <Link
                        href={`/product/${product?.variant?.product?.id}`}
                        className="flex gap-2 w-1/2 z-10"
                      >
                        <img
                          src={
                            product.thumbnail ?? "/images/placeholderImg.svg"
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
                      <ManageQty productItem={product} page="cart" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {cartBorrowItem?.length &&
            !cartBorrowItem?.[0]?.metadata?.borrowReturnDate ? (
              <ViewCartLayer
                actionText="Choose Period"
                handleAction={() => (isPopup.value = true)}
                borrowItems={cartBorrowItem?.length}
              />
            ) : (
              // confirm order or discard buttons
              <div className="fixed bottom-16 left-0 p-4 w-full flex items-center justify-around z-10 bg-secondray">
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

                <Button type="button" variant="danger" onClick={handleDiscard}>
                  Discard
                </Button>
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
          subtitle={`Request ID: ${cart.orderStore?.value?.data?.id}`}
          actionText="Check request"
          actionLink={`/orders/${cart.orderStore.value?.data?.id}`}
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
      <BottomNavbar />
    </div>
  );
};

export default Cart;
