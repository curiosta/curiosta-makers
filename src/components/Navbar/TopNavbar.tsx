import Button from "@components/Button";
import Menubar from "@components/Menubar";
import { useSignal } from "@preact/signals";
import Chip from "@components/Chip";
import { isUser } from "@/store/userState";
import user from "@/api/user";
import admin from "@/api/admin";
import cart from "@/api/cart";

const TopNavbar = () => {
  const isMenuOpen = useSignal<boolean>(false);
  const currentUser = isUser.value
    ? user.customer.value
    : admin.adminData.value;

  const totalCartItems = isUser.value ? cart.store.value?.items?.length : null;

  return (
    <div className="flex justify-between items-center w-full">
      <Button
        type="button"
        variant="icon"
        className="border !rounded-full"
        onClick={() => (isMenuOpen.value = true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </Button>

      <div className="flex items-center gap-2">
        {isUser.value ? (
          <Button
            link="/cart"
            variant="icon"
            className="!text-lg gap-1 items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
            >
              <g clip-path="url(#clip0_356_4461)">
                <path
                  d="M15.55 13.5C16.3 13.5 16.96 13.09 17.3 12.47L20.88 5.98C21.25 5.32 20.77 4.5 20.01 4.5H5.21L4.27 2.5H1V4.5H3L6.6 12.09L5.25 14.53C4.52 15.87 5.48 17.5 7 17.5H19V15.5H7L8.1 13.5H15.55ZM6.16 6.5H18.31L15.55 11.5H8.53L6.16 6.5ZM7 18.5C5.9 18.5 5.01 19.4 5.01 20.5C5.01 21.6 5.9 22.5 7 22.5C8.1 22.5 9 21.6 9 20.5C9 19.4 8.1 18.5 7 18.5ZM17 18.5C15.9 18.5 15.01 19.4 15.01 20.5C15.01 21.6 15.9 22.5 17 22.5C18.1 22.5 19 21.6 19 20.5C19 19.4 18.1 18.5 17 18.5Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_356_4461">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            {totalCartItems ?? 0}
          </Button>
        ) : null}
        <div className="w-9 h-9 flex">
          <Chip className="!bg-primary-700 uppercase text-white">
            {currentUser?.first_name
              ? currentUser?.first_name.charAt(0)
              : currentUser?.email.charAt(0)}
          </Chip>
        </div>
      </div>
      <Menubar isMenuOpen={isMenuOpen} />
    </div>
  );
};

export default TopNavbar;
