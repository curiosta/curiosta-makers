import Button from "@/components/Button";
import Chip from "@/components/Chip";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import TopNavbar from "@/components/Navbar/TopNavbar";
import Typography from "@/components/Typography";
import led_icon from "@assets/led.svg";
import { useSignal } from "@preact/signals";

type Props = {
  id: string;
};

const PickItems = ({ id }: Props) => {
  const isPicked = useSignal<boolean>(false);

  return (
    <div className="flex flex-col justify-center items-center   p-4 w-full sm:w-1/4 ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Pick Items</Typography>
      </div>
      <Typography size="body1/normal" className="w-full">
        Pick Id {id}
      </Typography>
      <div className="flex flex-col gap-4 my-2 mb-12">
        {Array(5)
          .fill(1)
          .map((item, index) => (
            <div className="w-full bg-secondray shadow-lg rounded-2xl p-4">
              <Typography size="small/normal">Item {index + 1}</Typography>
              <div className="flex gap-2 border-b">
                <img src={led_icon} alt="icon" className="w-8" />
                <Typography size="body1/normal" className="text-start">
                  LED RED CLEAR 1206 SMD...
                </Typography>
              </div>
              <div className="grid grid-cols-5 w-full items-center my-2">
                <Button type="button" variant="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M9 5.72727C7.19182 5.72727 5.72727 7.19182 5.72727 9C5.72727 10.8082 7.19182 12.2727 9 12.2727C10.8082 12.2727 12.2727 10.8082 12.2727 9C12.2727 7.19182 10.8082 5.72727 9 5.72727ZM16.3145 8.18182C15.9382 4.77 13.23 2.06182 9.81818 1.68545V0H8.18182V1.68545C4.77 2.06182 2.06182 4.77 1.68545 8.18182H0V9.81818H1.68545C2.06182 13.23 4.77 15.9382 8.18182 16.3145V18H9.81818V16.3145C13.23 15.9382 15.9382 13.23 16.3145 9.81818H18V8.18182H16.3145ZM9 14.7273C5.83364 14.7273 3.27273 12.1664 3.27273 9C3.27273 5.83364 5.83364 3.27273 9 3.27273C12.1664 3.27273 14.7273 5.83364 14.7273 9C14.7273 12.1664 12.1664 14.7273 9 14.7273Z"
                      fill="black"
                    />
                  </svg>
                </Button>
                <Typography>Zone A</Typography>
                <Typography>Aisle 1</Typography>
                <Typography>Rack 1</Typography>
                <Typography className="whitespace-nowrap">Bin CA01</Typography>
              </div>
              <div className="flex items-center w-full justify-evenly ">
                <Typography className="flex items-center gap-2">
                  Qty<Chip className="!bg-gray-100">1</Chip>
                </Typography>

                {!isPicked.value ? (
                  <div className="flex items-center justify-evenly w-full">
                    <Button
                      type="button"
                      onClick={() => (isPicked.value = true)}
                    >
                      Pick
                    </Button>
                    <Button type="button" variant="danger">
                      Short closed
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    className="items-center gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        d="M4.45455 7.6194L1.11364 4.79851L0 5.73881L4.45455 9.5L14 1.4403L12.8864 0.5L4.45455 7.6194Z"
                        fill="#0B7278"
                      />
                    </svg>
                    Picked
                  </Button>
                )}
              </div>
            </div>
          ))}
        <div className="w-full flex justify-center my-2">
          <Button type="button">Fullfil</Button>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default PickItems;
