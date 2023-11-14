import { Signal } from "@preact/signals";
import Button from "../Button";
import Typography from "../Typography";
import { useEffect } from "preact/hooks";
import user from "@/api/user";
import { route } from "preact-router";
import { isUser } from "@/store/userState";
import admin from "@/api/admin";
import {
  menubarAdminItems,
  menubarBottomList,
  menubarItems,
} from "./menubarLists";

type Props = {
  isMenuOpen: Signal<boolean>;
};

const Menubar = ({ isMenuOpen }: Props) => {
  // remove app's default scroll if menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen.value ? "hidden" : "auto";
  }, [isMenuOpen.value]);

  const handleClick = async (title: string) => {
    if (title.includes("Sign out")) {
      isUser.value ? await user.logout() : await admin.logout();
      route("/login");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full opacity-0 bg-primary-100/40 -z-10 overflow-y-auto ${
        isMenuOpen.value ? "!z-20 opacity-100" : ""
      }`}
    >
      {/* close on outside click */}
      <div
        className="block w-full h-full"
        onClick={() => (isMenuOpen.value = false)}
      />
      <div
        className={`absolute top-0 left-0 bg-secondary h-full w-full max-w-xs transition-all -translate-x-full p-4 ${
          isMenuOpen.value ? "!translate-x-0" : ""
        }`}
      >
        {/* close menubar */}
        <div className="flex justify-end items-center">
          <Button
            type="button"
            variant="icon"
            onClick={() => (isMenuOpen.value = false)}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
        <div className="flex flex-col items-start mt-8 gap-3">
          {isUser.value
            ? menubarItems.map((item, index) => (
                <Button
                  key={index}
                  link={item.link}
                  variant="icon"
                  className="gap-4"
                >
                  {item.icon}
                  <Typography size="body2/normal" className="capitalize">
                    {item.title}
                  </Typography>
                </Button>
              ))
            : menubarAdminItems.map((item, index) => (
                <Button
                  key={index}
                  link={item.link}
                  variant="icon"
                  className="gap-4"
                >
                  {item.icon}
                  <Typography size="body2/normal" className="capitalize">
                    {item.title}
                  </Typography>
                </Button>
              ))}
        </div>
        <div className="flex flex-col items-start gap-2 absolute bottom-4">
          {menubarBottomList.map((item, index) => (
            <Button
              type="button"
              key={index}
              variant="icon"
              className="gap-4"
              onClick={() => handleClick(item.title)}
            >
              {item.icon}
              <Typography size="body2/normal">{item.title}</Typography>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menubar;
