import TopNavbar from "@components/Navbar/TopNavbar";
import Typography from "@components/Typography";
import led_icon from "@assets/led.svg";
import Button from "@components/Button";
import BottomNavbar from "@components/Navbar/BottomNavbar";
import PopUp from "@components/Popup";
import { isPopup } from "@/store/popUpState";

const IssuedItemsDetails = () => {
  return (
    <div className="flex flex-col justify-center items-center   p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Issued Items</Typography>
      </div>
      <div className="flex justify-between p-2 px-8 shadow rounded-lg w-full bg-secondray">
        <Typography size="h6/normal">Items</Typography>
        <Typography size="h6/normal">Quantity</Typography>
      </div>
      <div className="w-full pr-8">
        {Array(5)
          .fill(1)
          .map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center my-3 py-2 border-b last:border-none"
            >
              <div className="flex gap-2">
                <img src={led_icon} alt="icon" className="w-8" />
                <Typography size="body1/normal" className="!w-9/12 text-start">
                  LED RED CLEAR 1206 SMD...
                </Typography>
              </div>
              <Typography>x1</Typography>
            </div>
          ))}
      </div>
      <div className=" w-full flex items-center justify-evenly">
        <Button type="button" onClick={() => (isPopup.value = true)}>
          Approve
        </Button>
        <Button type="button" variant="danger">
          Reject
        </Button>
      </div>
      <PopUp
        title="Request is approved and picking task is created successfully"
        subtitle="Pick Task id 345"
        actionText="Start Picking"
        actionLink="/pick-items/345"
      />
      <BottomNavbar />
    </div>
  );
};

export default IssuedItemsDetails;
