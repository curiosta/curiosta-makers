import Loading from "../Loading";

const LoadingPopUp = ({ loadingText }: { loadingText: string }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-10  flex backdrop-brightness-75 items-center justify-center">
      <div className="absolute bg-secondray  rounded-2xl transition-all p-6">
        <Loading loadingText={loadingText} />
      </div>
    </div>
  );
};

export default LoadingPopUp;
