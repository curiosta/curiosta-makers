import Button from "@components/Button";
import Typography from "@components/Typography";
import logo from "@assets/curiosta_logo.png";

const Welcome = () => {
  return (
    <div className="flex justify-center  ">
      <div className="bg-neutral-50 flex flex-col justify-center items-center gap-10 w-1/4 rounded-2xl py-8">
        <div className="p-2.5 flex-col justify-between items-start gap-2.5 flex">
          <div className="w-80 h-60 flex-col justify-center items-center inline-flex">
            <img className="shadow" src={logo} />
            <Typography size="h6/bold" className="text-center">
              MMS
            </Typography>
          </div>
        </div>
        <Typography
          size="h6/bold"
          variant="app-primary"
          className="text-center "
        >
          Let's make things together!
        </Typography>
        <Typography variant="secondary" className="text-center ">
          Unlimited opportunity to unleash your creative side is just a click
          Away!
        </Typography>

        <Button type="button">Get Started!</Button>
      </div>
    </div>
  );
};

export default Welcome;
