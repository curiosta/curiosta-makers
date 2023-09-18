import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import { Link } from "preact-router";

const Master = () => {
  const masterOptions = [
    { title: "Category Master", link: "/category-master" },
    { title: "Material Master", link: "/material-master" },
    // { title: "Location Master", link: "#" },
    // { title: "Access Master", link: "#" },
  ];

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Master</Typography>
      </div>
      <div className="my-8">
        <Typography size="h6/normal">Select Master</Typography>
      </div>

      <div className="grid grid-cols-2 gap-4  ">
        {masterOptions.map((item, index) => (
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

export default Master;
