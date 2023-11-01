import { adminCustomersList } from "@/api/admin/customers/listCustomers";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import OffsetPagination from "@/components/OffsetPagination";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";
import SearchInput from "@/components/SearchInput";
import Typography from "@/components/Typography";
import UserCard from "@/components/UserCard";
import { selectedUser } from "@/store/draftOrderStore";
import { Customer, Region } from "@medusajs/medusa";
import { useSignal } from "@preact/signals";
import { route } from "preact-router";
import { useEffect } from "preact/hooks";

type TLoadableOptions = "user:get" | "draftOrder:create";

const IssueInventory = () => {
  const users = useSignal<Customer[]>([]);
  const isLoading = useSignal<TLoadableOptions | undefined>(undefined);
  const count = useSignal<null | number>(null);
  const limit = useSignal<number>(10);
  const offset = useSignal<number>(0);
  const searchTerm = useSignal<string | undefined>(undefined);
  const errorMessage = useSignal<string | undefined>(undefined);

  const getUsers = async () => {
    isLoading.value = "user:get";
    try {
      const usersRes = await adminCustomersList({
        q: searchTerm.value ? searchTerm.value : undefined,
        has_account: true,
        limit: limit.value,
        offset: offset.value,
      });
      if (!usersRes?.customers?.length && usersRes?.count) {
        offset.value = 0;
      }
      users.value = usersRes?.customers;
      count.value = usersRes?.count;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = undefined;
    }
  };

  useEffect(() => {
    if (searchTerm.value) {
      const getData = setTimeout(() => {
        getUsers();
      }, 500);
      return () => clearTimeout(getData);
    }
    getUsers();
  }, [offset.value, searchTerm.value]);

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Issue Inventory</Typography>
      </div>
      <div className="w-full mb-12 max-w-2xl">
        <SearchInput
          searchTerm={searchTerm}
          placeholder="Search active users"
          isSearchSort={false}
        />

        <div className="text-center my-2 w-full mb-20">
          {isLoading.value !== "user:get" ? (
            users.value?.length ? (
              <div
                className={`w-full flex flex-col  my-4 gap-4 ${
                  count.value < limit.value ? "mb-20" : ""
                }`}
              >
                {users.value.map((user, index) => (
                  <UserCard user={user} selectedUser={selectedUser} />
                ))}
                <OffsetPagination limit={limit} offset={offset} count={count} />
              </div>
            ) : !users.value?.length && count.value ? (
              <div className="w-full h-40 ">
                <Loading loadingText="loading" />
              </div>
            ) : (
              <Typography className="w-full">User not found</Typography>
            )
          ) : (
            <div className="h-40">
              <Loading loadingText="loading" />
            </div>
          )}

          {errorMessage.value ? (
            <Typography
              variant="error"
              className="text-center my-8 whitespace-break-spaces"
            >
              {errorMessage.value}
            </Typography>
          ) : null}
        </div>
        {isLoading.value === "draftOrder:create" ? (
          <LoadingPopUp loadingText="Please wait" />
        ) : null}

        <BottomNavbar />
      </div>
    </div>
  );
};

export default IssueInventory;
