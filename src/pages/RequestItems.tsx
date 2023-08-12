import Button from "@/components/Button";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import SearchInput from "@/components/SearchInput";
import Typography from "@/components/Typography";
import led_icon from "@assets/led.svg";

interface Props {
  title: string;
}

const RequestItems = ({ title }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center  bg-neutral-50 p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Request Items</Typography>
      </div>
      <SearchInput />

      <div className="text-center my-2 w-full mb-12">
        <Typography size="h6/normal" className="capitalize">
          {title.replaceAll("-", " ")}
        </Typography>

        {Array(5)
          .fill(1)
          .map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center my-3 py-2 border-b last:border-none"
            >
              <div className="flex items-start gap-2">
                <img src={led_icon} alt="icon" className="w-8" />
                <Typography size="body1/normal" className="!w-9/12 text-start">
                  LED RED CLEAR 1206 SMD...
                </Typography>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="!w-20 !border-primary-700 !text-app-primary-700 border-2 !rounded-lg uppercase"
                onClick={() => console.log("click", index)}
              >
                Add
              </Button>
            </div>
          ))}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default RequestItems;
