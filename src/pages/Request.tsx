import SearchInput from "@components/SearchInput";
import TopNavbar from "@components/Navbar/TopNavbar";
import Typography from "@components/Typography";
import Button from "@components/Button";
import print_icon from "@assets/3d_print.svg";
import leset_cut_icon from "@assets/laser_cut.svg";

const Request = () => {
  return (
    <div className="flex flex-col justify-center items-center  bg-neutral-50 p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Request Items</Typography>
      </div>
    </div>
  );
};

export default Request;
