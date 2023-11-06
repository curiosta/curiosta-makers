import TopNavbar from "@/components/Navbar/TopNavbar";
import UserCreationProgress from "@/components/Progressbar/UserCreationProgress";
import Typography from "@/components/Typography";
import { useSignal } from "@preact/signals";
import BottomNavbar from "@/components/Navbar/BottomNavbar";
import CreateUserInfo from "@/components/CreateUserInfo";
import UserBiometricInfo from "@/components/CreateUserInfo/UserBiometricInfo";
import Button from "@/components/Button";
import { Customer } from "@medusajs/medusa";
import { TCustomer } from "@/api/user";
import { adminCreateCustomer } from "@/api/admin/customers/createCustomer";
import PopUp from "@/components/Popup";
import LoadingPopUp from "@/components/Popup/LoadingPopUp";

export type TBasicInfo = {
  dob: Date;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  gender: string;
};
export type TDocumentInfo = {
  idType: string;
  idNumber: string;
  idImageKey: string;
}[];

const CreateUser = () => {
  const basicInfo = useSignal<TBasicInfo | null>(null);
  const documentInfo = useSignal<TDocumentInfo>([]);
  const profileImageKey = useSignal<string | null>(null);
  const activeStep = useSignal<number>(1);
  const isLoading = useSignal<boolean>(false);
  const addUser = useSignal<TCustomer | null>(null);
  const errorMessage = useSignal<string | undefined>(undefined);
  const isUserPopUp = useSignal<boolean>(false);
  const selectedGender = useSignal<string | undefined>(undefined);

  const handleBasicInfo = (data: TBasicInfo) => {
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    if (!selectedGender.value) {
      return (errorMessage.value = "Select gender!");
    }
    basicInfo.value = data;
    activeStep.value = activeStep.value + 1;
  };

  // generate random password
  function genPassword(passwordLength: number) {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    let counter = 0;
    while (counter < passwordLength) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
      counter += 1;
    }
    return password;
  }

  const handleCreateUser = async () => {
    isLoading.value = true;
    if (errorMessage.value) {
      errorMessage.value = null;
    }
    try {
      if (!basicInfo.value) return;
      const { first_name, last_name, email, phone, dob, gender } =
        basicInfo.value;
      const password = genPassword(12);
      const addUserRes = await adminCreateCustomer({
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        password: password,
        metadata: {
          dob: dob,
          gender: gender,
          profile_image_key: profileImageKey.value,
          documentInfo: documentInfo.value,
          temp_password: password,
          new_account: true,
        },
      });
      addUser.value = addUserRes?.customer;
      isUserPopUp.value = true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("422")) {
          return (errorMessage.value = "User already exists with this email");
        }
        errorMessage.value = error.message;
      }
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full ">
      <TopNavbar />
      <div className="my-2">
        <Typography size="h6/normal">Create user</Typography>
      </div>
      <div className="w-full mb-12 max-w-2xl">
        <UserCreationProgress activeStep={activeStep.value} />

        {activeStep.value === 1 ? (
          <CreateUserInfo
            handleBasicInfo={handleBasicInfo}
            selectedGender={selectedGender}
            errorMessage={errorMessage}
          />
        ) : activeStep.value === 2 ? (
          <UserBiometricInfo
            documentInfo={documentInfo}
            profileImageKey={profileImageKey}
            activeStep={activeStep}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <Typography size="body1/semi-bold" className="text-center">
              Review and Confirm
            </Typography>
            <div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 17"
                  fill="none"
                  className="h-6 w-6 text-third-500"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.00037 8.29981C6.2268 8.29981 4.78524 6.86464 4.78524 5.09988C4.78524 3.33511 6.2268 1.89994 8.00037 1.89994C9.77393 1.89994 11.2155 3.33511 11.2155 5.09988C11.2155 6.86464 9.77393 8.29981 8.00037 8.29981ZM11.0211 8.83818C11.6821 8.31186 12.1918 7.6198 12.4985 6.83246C12.8051 6.04512 12.8976 5.19058 12.7667 4.35585C12.4491 2.25749 10.6955 0.578364 8.57796 0.333569C5.65642 -0.00482461 3.17807 2.25914 3.17807 5.09988C3.17807 6.61185 3.88205 7.959 4.97963 8.83818C2.28208 9.84696 0.312521 12.2157 0.00372759 15.4125C-0.00706903 15.5246 0.00565076 15.6378 0.0410682 15.7447C0.0764855 15.8516 0.133824 15.9499 0.209418 16.0334C0.285012 16.1169 0.377196 16.1837 0.480079 16.2295C0.582962 16.2754 0.694282 16.2993 0.806916 16.2997C1.00435 16.3012 1.19525 16.2291 1.3422 16.0972C1.48915 15.9654 1.58156 15.7833 1.6013 15.5869C1.92369 12.0165 4.67004 9.89978 8.00037 9.89978C11.3307 9.89978 14.077 12.0165 14.3994 15.5869C14.4192 15.7833 14.5116 15.9654 14.6585 16.0972C14.8055 16.2291 14.9964 16.3012 15.1938 16.2997C15.6706 16.2997 16.0418 15.8853 15.9962 15.4125C15.6882 12.2157 13.7186 9.84696 11.0203 8.83818"
                    fill="currentColor"
                  />
                </svg>
                <Typography>Basic information</Typography>
              </div>
              <Typography className="capitalize">
                {basicInfo.value?.first_name} {basicInfo.value?.last_name}
              </Typography>
              <Typography className="capitalize">
                {basicInfo.value?.gender}
              </Typography>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6 fill-third-600"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clip-rule="evenodd"
                  />
                </svg>
                <Typography>Contact information</Typography>
              </div>
              <Typography>{basicInfo.value?.email}</Typography>
              <Typography>{basicInfo.value?.phone}</Typography>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6 fill-third-600"
                >
                  <path d="M15 1.784l-.796.796a1.125 1.125 0 101.591 0L15 1.784zM12 1.784l-.796.796a1.125 1.125 0 101.591 0L12 1.784zM9 1.784l-.796.796a1.125 1.125 0 101.591 0L9 1.784zM9.75 7.547c.498-.02.998-.035 1.5-.042V6.75a.75.75 0 011.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 011.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 00-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 011.5 0v.797zM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 012.585.364 2.605 2.605 0 002.33 0 4.104 4.104 0 013.67 0 2.605 2.605 0 002.33 0 4.104 4.104 0 013.67 0 2.605 2.605 0 002.33 0 4.104 4.104 0 012.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0012 12.75zM21.75 18.131a2.604 2.604 0 00-1.915.165 4.104 4.104 0 01-3.67 0 2.604 2.604 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.604 2.604 0 00-2.33 0 4.104 4.104 0 01-3.67 0 2.604 2.604 0 00-1.915-.165v2.494c0 1.036.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-2.494z" />
                </svg>
                <Typography>Date of birth</Typography>
              </div>
              <Typography>
                {new Date(basicInfo.value?.dob).toLocaleDateString("en-GB")}
              </Typography>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6 fill-third-600"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z"
                    clip-rule="evenodd"
                  />
                </svg>
                <Typography>Identification Proof</Typography>
              </div>
              {documentInfo.value?.length ? (
                documentInfo.value?.map((info) => (
                  <div>
                    <Typography>
                      {info.idType}
                      {":"} {info.idNumber}
                    </Typography>
                    {info.idImageKey ? (
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          class="w-6 h-6 fill-primary-600"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <Typography>Picture of proof uploaded</Typography>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          class="w-6 h-6 fill-danger-600"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <Typography>Picture of proof not uploaded</Typography>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6 fill-danger-600"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <Typography>ID card info not provided</Typography>
                </div>
              )}
              {profileImageKey.value ? (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6 fill-primary-600"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <Typography>Profile picture uploaded</Typography>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6 fill-danger-600"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <Typography>Profile picture not uploaded</Typography>
                </div>
              )}
            </div>
            {errorMessage.value ? (
              <Typography variant="error" className="text-center mt-2">
                {errorMessage.value}
              </Typography>
            ) : null}
            <div className="w-full flex justify-between items-center my-4">
              <Button
                type="button"
                onClick={() => {
                  (activeStep.value = activeStep.value - 1),
                    (errorMessage.value = null);
                }}
              >
                Back
              </Button>
              <Button type="button" onClick={handleCreateUser}>
                Submit and Create
              </Button>
            </div>
          </div>
        )}
      </div>

      {isLoading.value ? (
        <LoadingPopUp loadingText="Please wait" />
      ) : (
        <PopUp
          isPopup={isUserPopUp}
          title="User is created successfully. Please save login credentials"
          actionLink={`/user/${addUser.value?.id}`}
          actionText="Check Profile"
          subtitle={`Email: ${addUser.value?.email}, Password: ${addUser.value?.metadata?.temp_password}`}
        />
      )}
      <BottomNavbar />
    </div>
  );
};

export default CreateUser;
