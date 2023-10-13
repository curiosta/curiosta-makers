import { adminCustomersList } from "@/api/admin/customers/listCustomers";
import { Customer } from "@medusajs/medusa";
import { Signal, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import Typography from "../Typography";
import Loading from "../Loading";
import MultiRadio from "../MultiRadio";

type TDraftOrderUserInfo = {
  selectedUser: Signal<Customer>;
  selectedUserEmail: Signal<string>;
};

const DraftOrderUserInfo = ({
  selectedUser,
  selectedUserEmail,
}: TDraftOrderUserInfo) => {
  const users = useSignal<Customer[]>([]);
  const isLoading = useSignal<boolean>(false);
  const searchTerm = useSignal<string | undefined>(undefined);

  const getUsers = async () => {
    isLoading.value = true;
    try {
      const usersRes = await adminCustomersList({
        q: searchTerm.value ? searchTerm.value : undefined,
        has_account: true,
        limit: 0,
        offset: 0,
      });
      users.value = usersRes?.customers;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
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
  }, [searchTerm.value]);

  selectedUser.value = users.value?.filter((user) =>
    selectedUserEmail.value ? user.email === selectedUserEmail.value : null
  )[0];

  return (
    <div className="w-full flex flex-col gap-4 mb-16">
      <Typography size="body1/semi-bold" className="text-center ">
        2. Select User
      </Typography>
      {isLoading.value ? (
        <div className="h-40">
          <Loading loadingText="loading" />
        </div>
      ) : (
        <MultiRadio
          placeholder="Search user..."
          options={users.value}
          selectedValue={selectedUserEmail}
        />
      )}
    </div>
  );
};

export default DraftOrderUserInfo;
