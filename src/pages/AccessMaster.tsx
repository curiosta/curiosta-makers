import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import { Link } from "preact-router";

const AccessMaster = () => {
  const accessOptions = [
    { title: "User Access", link: "/access-master/user-access" },
    { title: "Admin User Access", link: "/access-master/admin-access" },
  ];
  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Access Master</Typography>
      </div>

      <div className="grid grid-cols-1 gap-4 my-8 ">
        {accessOptions.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="flex justify-center items-center p-4 h-24 bg-primary-700 text-secondray rounded-xl"
          >
            <Typography className="text-center ">{item.title}</Typography>
          </Link>
        ))}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default AccessMaster;
