import SearchInput from "@components/SearchInput";
import TopNavbar from "@components/Navbar/TopNavbar";
import Typography from "@components/Typography";
import Button from "@components/Button";
import print_icon from "@assets/3d_print.svg";
import leset_cut_icon from "@assets/laser_cut.svg";
import milling_icon from "@assets/milling.svg";
import BottomNavbar from "@components/Navbar/BottomNavbar";

const Request = () => {
  const categories = [
    {
      title: "3D Printing & Scanning",
      icon: print_icon,
    },
    {
      title: "Lesser Cutting",
      icon: leset_cut_icon,
    },
    {
      title: "CNC Milling",
      icon: milling_icon,
    },
    {
      title: "3D Printing & Scanning",
      icon: print_icon,
    },
    {
      title: "Lesser Cutting",
      icon: leset_cut_icon,
    },
    {
      title: "CNC Milling",
      icon: milling_icon,
    },
    {
      title: "3D Printing & Scanning",
      icon: print_icon,
    },
    {
      title: "Lesser Cutting",
      icon: leset_cut_icon,
    },
    {
      title: "CNC Milling",
      icon: milling_icon,
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center  bg-neutral-50 p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Request Items</Typography>
      </div>
      <SearchInput />

      <div className="text-center my-2 w-full mb-12">
        <Typography size="h6/normal">Choose Category</Typography>

        <div className="grid grid-cols-3 my-2 items-start gap-4">
          {categories.map((category, index) => (
            <Button
              key={index}
              link={`/create-requests/${category.title
                .replaceAll(" ", "-")
                .toLowerCase()}`}
              variant="icon"
              className={"flex-col items-center gap-2 !p-0"}
            >
              <div className="border border-black rounded-full bg-secondray shadow-lg">
                <img src={category.icon} alt="icon" className="p-3" />
              </div>
              <Typography size="body2/normal">{category.title}</Typography>
            </Button>
          ))}
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Request;
