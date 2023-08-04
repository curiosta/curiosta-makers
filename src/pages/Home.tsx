import Typography from "@components/Typography";
import TopNavbar from "@components/Navbar/TopNavbar";
import SearchInput from "@components/SearchInput";
import ActivityCard from "@components/ActivityCard";
import IssuedItems from "@components/IssuedItems";
import BottomNavbar from "@components/Navbar/BottomNavbar";
import { isUser } from "@/store/userState";
import user from "@/api/user";
import admin from "@/api/admin";
import MiddleContent from "@/components/MiddleContent";

const Home = () => {
  const currentUser = isUser.value
    ? user.customer.value
    : admin.adminData.value;
  return (
    <div className="flex flex-col justify-center items-center  bg-neutral-50 p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="w-full pl-2 my-4">
        <Typography>
          Hello{" "}
          {currentUser.first_name ? currentUser.first_name : currentUser.email}
          👋
        </Typography>
        <Typography size="small/normal">
          Let’s find you something to make
        </Typography>
      </div>
      <SearchInput />
      <ActivityCard />
      {!isUser.value ? <MiddleContent /> : null}
      <IssuedItems />
      <BottomNavbar />
    </div>
  );
};

export default Home;
