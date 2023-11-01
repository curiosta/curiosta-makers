import { useSignal } from "@preact/signals";
import Button from "../Button";
import FormControl from "../FormControl";
import Input from "../Input";
import Typography from "../Typography";
import { ChangeEvent } from "preact/compat";
import man_icon from "@assets/man-gender.svg";
import female_icon from "@assets/female-gender.svg";
import other_icon from "@assets/other-gender.svg";
import { TBasicInfo } from "@pages/CreateUser";

type TCreateUserInfo = {
  handleBasicInfo: (data: TBasicInfo) => void;
};

const CreateUserInfo = ({ handleBasicInfo }: TCreateUserInfo) => {
  const selectedGender = useSignal<string | undefined>(undefined);

  const genderList = [
    {
      title: "male",
      icon: man_icon,
    },
    {
      title: "female",
      icon: female_icon,
    },
    {
      title: "other",
      icon: other_icon,
    },
  ];

  const handleSelectGender = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.currentTarget;
    if (checked) {
      selectedGender.value = value;
    }
  };

  return (
    <FormControl
      noValidate
      mode="onSubmit"
      onSubmit={handleBasicInfo}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
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
        <div className="flex flex-col p-4 border-2 bg-secondray divide-y divide-gray-600 rounded-lg">
          <Input
            type="text"
            name="first_name"
            className="!ring-0 !shadow-none"
            placeholder="First name of the user *"
            autocomplete="given-name"
            required={{ message: "First name is required!", value: true }}
            minLength={3}
            maxLength={20}
          />
          <Input
            type="text"
            name="last_name"
            className="!ring-0 !shadow-none"
            placeholder="Last name of the user *"
            autocomplete="family-name"
            required={{ message: "Last name is required!", value: true }}
            minLength={3}
            maxLength={20}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
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
        <div className="flex flex-col p-4 border-2 bg-secondray divide-y divide-gray-600 rounded-lg">
          <Input
            type="tel"
            name="phone"
            className="!ring-0 !shadow-none"
            autocomplete="tel"
            required={{ message: "Phone number is required!", value: true }}
            validator={(value) =>
              !/^\+\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
                value
              )
                ? "Invalid phone number!"
                : true
            }
            placeholder={"+91 9876543210"}
          />
          <Input
            type="email"
            name="email"
            className="!ring-0 !shadow-none"
            placeholder="Email id of the user *"
            autocomplete="email"
            required={{ message: "Email is required!", value: true }}
            validator={(value) =>
              !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
                ? "Invalid email!"
                : true
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
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
        <Input
          type="date"
          name="dob"
          max={new Date().toISOString().split("T")[0]}
          required={{ message: "Date of birth is required!", value: true }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Typography>Select gender</Typography>
        <div className="flex items-center justify-evenly">
          {genderList.map((gender) => (
            <label
              className={`flex flex-col gap-2 items-center bg-secondray w-20 border shadow-sm rounded-lg cursor-pointer relative ${
                selectedGender.value === gender.title.toLowerCase()
                  ? "ring-1 ring-primary-600"
                  : ""
              }`}
            >
              <Input
                type="radio"
                name="gender"
                value={gender.title.toLowerCase()}
                className="sr-only"
                onClick={handleSelectGender}
                required={{ message: "Select gender!", value: true }}
              />
              <img src={gender.icon} alt="gender" />
              <Typography className="capitalize">{gender.title}</Typography>
            </label>
          ))}
        </div>
      </div>
      <div className="w-full flex justify-end items-center my-4">
        <Button type="submit">Next</Button>
      </div>
    </FormControl>
  );
};

export default CreateUserInfo;
