import Button from "@components/Button";
import Typography from "@components/Typography";
import SiteFooter from "@/components/SiteFooter";
import { APP_DISPLAY_NAME, APP_FULL_NAME } from "@/config/brand";

const Welcome = () => {
  return (
    <>
    <div className="flex justify-center min-h-[80vh] p-4">
      <div className="flex flex-col justify-center items-center gap-10  w-full max-w-xl ">
        <div className="flex flex-col  items-center gap-2.5 ">
          <img src="/images/curiosta_logo.svg" alt="Curiosta" />
          <Typography tag="h1" size="h6/bold" className="text-center">
            {APP_DISPLAY_NAME}
          </Typography>
          <Typography variant="secondary" className="text-center">
            {APP_FULL_NAME}
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
    <SiteFooter />
    </>
  );
};

export default Welcome;
