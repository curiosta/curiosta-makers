import cart from "@/api/cart";
import { draftOrderItems } from "@/store/draftOrderStore";
import { isUser } from "@/store/userState";
import Button from "@components/Button";
import Typography from "@components/Typography";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

type Props = {
  borrowItems?: number;
  actionText: string;
  actionLink?: string;
  handleAction?: () => void;
};

const ViewCartLayer = ({
  actionText,
  actionLink,
  handleAction,
  borrowItems,
}: Props) => {
  const isCartLayer = useSignal<boolean>(false);
  const totalCartItems = isUser.value
    ? cart.store.value?.items?.length
    : draftOrderItems.value?.length;

  useEffect(() => {
    if (totalCartItems > 0) {
      isCartLayer.value = true;
    } else {
      isCartLayer.value = false;
    }
  }, [totalCartItems]);

  return (
    <div
      className={`fixed left-0 bottom-16 z-10  w-full bg-secondary transition-all shadow-lg ${
        isCartLayer.value ? "translate-x-0" : "translate-x-full"
      } `}
    >
      <div className="flex justify-between items-center relative p-4 gap-2 mx-auto max-w-2xl">
        <div className="flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
          >
            <path
              d="M15.0463 11C15.7963 11 16.4563 10.59 16.7963 9.97L20.3763 3.48C20.7463 2.82 20.2663 2 19.5063 2H4.70634L3.76634 0H0.496338V2H2.49634L6.09634 9.59L4.74634 12.03C4.01634 13.37 4.97634 15 6.49634 15H18.4963V13H6.49634L7.59634 11H15.0463ZM5.65634 4H17.8063L15.0463 9H8.02634L5.65634 4ZM6.49634 16C5.39634 16 4.50634 16.9 4.50634 18C4.50634 19.1 5.39634 20 6.49634 20C7.59634 20 8.49634 19.1 8.49634 18C8.49634 16.9 7.59634 16 6.49634 16ZM16.4963 16C15.3963 16 14.5063 16.9 14.5063 18C14.5063 19.1 15.3963 20 16.4963 20C17.5963 20 18.4963 19.1 18.4963 18C18.4963 16.9 17.5963 16 16.4963 16Z"
              fill="#0B7278"
            />
          </svg>
          <div>
            <Typography>
              Total {totalCartItems} {`item${totalCartItems > 1 ? "s" : ""}`}{" "}
              added
            </Typography>
            {borrowItems ? (
              <Typography size="body2/normal">
                {borrowItems} {`item${borrowItems > 1 ? "s" : ""}`} added as
                Borrow Request
              </Typography>
            ) : null}
          </div>
        </div>
        {actionLink ? (
          <Button link={actionLink}>{actionText}</Button>
        ) : (
          <Button type="button" onClick={handleAction}>
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ViewCartLayer;
