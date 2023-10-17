import Button from "@components/Button";
import Typography from "@components/Typography";

const Welcome = () => {
  return (
    <div className="flex justify-center h-screen p-4">
      <div className="flex flex-col justify-center items-center gap-10  w-full sm:w-1/2 ">
        <div className="flex flex-col  items-center gap-2.5 ">
          <img src="/images/curiosta_logo.svg" alt="curiosta-logo" />
          <Typography size="h6/bold" className="text-center uppercase">
            MMS
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

        <Button link="/login" variant="primary" className="w-full">
          Get Started!
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
