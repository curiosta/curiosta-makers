import Button from "@components/Button";
import Typography from "@components/Typography";
import logo from "@assets/curiosta_logo.png";

const Welcome = () => {
  return (
    <div className="flex justify-center h-screen p-4">
      <div className="flex flex-col justify-center items-center gap-10 rounded-2xl w-full sm:w-1/4 ">
        <div className="flex flex-col  items-center gap-2.5 ">
          <img src={logo} alt="curiosta-logo" />
          <Typography size="h6/bold" className="text-center">
            IMS
          </Typography>
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

        <Button link="/login" variant="primary">
          Get Started!
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
