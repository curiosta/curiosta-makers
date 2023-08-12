import cart from "@/api/cart";
import Loading from "@/components/Loading";
import ManageQty from "@/components/ManageQty";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import ViewCartLayer from "@/components/ViewCartLayer";
import { isPopup } from "@/store/popUpState";
import PopUp from "@components/Popup";
import { useSignal } from "@preact/signals";
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

  const handleSelectDate = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked, name } = e.currentTarget;
    console.log(value);
    if (checked && value !== "custom") {
      selectedDate.value = value;
    }
    if (name === "custom_date") {
      selectedDate.value = new Date(value).toDateString();
    }

    // cartBorrowItem.map(async (item) => {
    //   try {
    //     await cart.updateItemMetaData({
    //       id: item.id,
    //       metadata: {
    //         cartType: "borrow",
    //         borrow: { returnDate: selectedDate.value },
    //       },
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Cart</Typography>
      </div>

      {!cartLoading ? (
        <div className="my-2 w-full mb-12 flex flex-col gap-4">
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
                  <div className="flex gap-2">
                    <img
                      src={product?.thumbnail || "N/A"}
                      alt="product"
                      className="w-8 h-8 object-cover"
                    />
                    <Typography size="body1/normal" className="text-start">
                      {product?.title}
                    </Typography>
                  </div>
                  <ManageQty productItem={product} />
                </div>
              ))}
            </div>
          ) : null}
          {cartBorrowItem?.length ? (
            <div>
              <div className="flex justify-between items-center">
                <Typography
                  size="body1/normal"
                  className="capitalize w-fit p-2 rounded-tl-2xl rounded-br-2xl bg-yellow-800 text-white"
                >
                  Borrow Requests
                </Typography>
                {selectedDate.value ? (
                  <Typography size="small/normal" className="w-1/2">
                    Expected Return Date: {selectedDate.value}
                  </Typography>
                ) : null}
              </div>
              {cartBorrowItem?.map((product, index) => (
                <div
                  key={product?.id}
                  className="flex justify-between items-center gap-4 my-3 py-2 border-b last:border-none relative"
                >
                  <div className="flex gap-2">
                    <img
                      src={product?.thumbnail || "N/A"}
                      alt="product"
                      className="w-8 h-8 object-cover"
                    />
                    <Typography size="body1/normal" className="text-start">
                      {product?.title}
                    </Typography>
                  </div>
                  <ManageQty productItem={product} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="h-40">
          <Loading />
        </div>
      )}

      <ViewCartLayer
        actionText="Choose Period"
        handleAction={() => (isPopup.value = true)}
        borrowItems={cartBorrowItem?.length}
      />
      <PopUp
        title="Please select a time window"
        actionText="Submit"
        handlePopupAction={handleSelectDate}
        formContents={timePeriodOptions}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Cart;
