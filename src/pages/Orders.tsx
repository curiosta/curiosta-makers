import { ordersList } from "@/api/user/orders/ordersList";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import OrderItem from "@/components/Orders/OrderItem";
import Typography from "@/components/Typography";
import { Order } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import OffsetPagination from "@components/OffsetPagination";
import { isUser } from "@/store/userState";
import { adminOrdersList } from "@/api/admin/orders/ordersList";
import SearchInput, { TSortOptions } from "@/components/SearchInput";
import { ChangeEvent } from "preact/compat";

const Orders = () => {
  const orders = useSignal<Order[]>([]);
  const isLoading = useSignal<boolean>(false);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(9);
  const offset = useSignal<number>(0);
  const searchTerm = useSignal<string | undefined>(undefined);
  const selectedSort = useSignal<string[]>([]);
  const sortOptions = useSignal<TSortOptions[]>([
    { option: "Pending", value: ["awaiting"] },
    { option: "Active", value: ["captured"] },
    { option: "Closed", value: ["fulfilled", "partially_fulfilled"] },
  ]);

  const getOrdersList = async () => {
    isLoading.value = true;
    try {
      const res = isUser.value
        ? await ordersList({
            q: searchTerm.value ? searchTerm.value : undefined,
            payment_status: selectedSort.value.some((active) =>
              ["awaiting", "captured"].includes(active)
            )
              ? selectedSort.value
              : [],
            fulfillment_status: selectedSort.value.some((active) =>
              ["fulfilled", "partially_fulfilled"].includes(active)
            )
              ? selectedSort.value
              : selectedSort.value.some((active) =>
                  ["captured"].includes(active)
                )
              ? ["not_fulfilled"]
              : [],
            limit: limit.value,
            offset: offset.value,
          })
        : await adminOrdersList({
            q: searchTerm.value ? searchTerm.value : undefined,
            payment_status: selectedSort.value.some((active) =>
              ["awaiting", "captured"].includes(active)
            )
              ? selectedSort.value
              : [],
            fulfillment_status: selectedSort.value.some((active) =>
              ["fulfilled", "partially_fulfilled"].includes(active)
            )
              ? selectedSort.value
              : selectedSort.value.some((active) =>
                  ["captured"].includes(active)
                )
              ? ["not_fulfilled"]
              : [],
            limit: limit.value,
            offset: offset.value,
          });
      count.value = res?.count;
      orders.value = res?.orders;
    } catch (error) {
    } finally {
      isLoading.value = false;
    }
  };

  useEffect(() => {
    if (searchTerm.value) {
      const getData = setTimeout(() => {
        getOrdersList();
      }, 500);
      return () => clearTimeout(getData);
    }
    getOrdersList();
  }, [offset.value, searchTerm.value, selectedSort.value]);

  const handleSortToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.currentTarget;
    if (checked) {
      selectedSort.value = value.split(",");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Orders</Typography>
      </div>
      <SearchInput
        searchTerm={searchTerm}
        sortOptions={sortOptions}
        isSearchSort={true}
        handleSortToggle={handleSortToggle}
      />
      {!isLoading.value ? (
        orders.value?.length ? (
          <div className="w-full flex flex-col gap-4 mb-12 ">
            {orders.value?.map((order) => (
              <OrderItem order={order} page="orders" />
            ))}
            <OffsetPagination limit={limit} offset={offset} count={count} />
          </div>
        ) : (
          <Typography>No order found</Typography>
        )
      ) : (
        <div className="h-40">
          <Loading loadingText="loading" />
        </div>
      )}
      <BottomNavbar />
    </div>
  );
};

export default Orders;
