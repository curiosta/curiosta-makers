import { adminOrdersList } from "@/api/admin/orders/ordersList";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import Typography from "@/components/Typography";
import { Order } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import OffsetPagination from "@components/OffsetPagination";
import TopNavbar from "@/components/Navbar/TopNavbar";
import OrderItem from "@/components/Orders/OrderItem";
import SearchInput from "@/components/SearchInput";

const Approve = () => {
  const orders = useSignal<Order[]>([]);
  const isLoading = useSignal<boolean>(false);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(9);
  const offset = useSignal<number>(0);
  const searchTerm = useSignal<string | undefined>(undefined);

  const getOrdersList = async () => {
    isLoading.value = true;
    try {
      const res = await adminOrdersList({
        q: searchTerm.value ? searchTerm.value : undefined,
        payment_status: ["awaiting"],
        fulfillment_status: ["not_fulfilled"],
        limit: limit.value,
        offset: offset.value,
      });
      if (!res?.orders?.length && res?.count) {
        offset.value = 0;
      }
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
  }, [offset.value, searchTerm.value]);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Approve request</Typography>
      </div>
      <div className="w-full mb-12 max-w-2xl">
        <SearchInput searchTerm={searchTerm} isSearchSort={false} />
        {!isLoading.value ? (
          orders.value?.length ? (
            <div className="w-full flex flex-col gap-4 mb-12 ">
              {orders.value?.map((order) => (
                <OrderItem order={order} page="orders" />
              ))}
              <OffsetPagination limit={limit} offset={offset} count={count} />
            </div>
          ) : !orders.value?.length && count.value ? (
            <div className="w-full h-40 ">
              <Loading loadingText="loading" />
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
    </div>
  );
};

export default Approve;
