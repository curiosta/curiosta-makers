import Typography from "@components/Typography";

const UserCreationProgress = ({ activeStep }: { activeStep: number }) => {
  const progressSteps = [
    { step: 1, stepText: "basic", title: "Basic info" },
    { step: 2, stepText: "biometric", title: "Biometric info" },
    { step: 3, stepText: "review", title: "Review and Confirm" },
  ];

  const currentStep = progressSteps.find(
    (val) => val.step === activeStep
  )?.step;

  return (
    <div className="w-full flex items-center justify-center mt-8 py-4 relative">
      <ol role="list" class="flex items-center">
        {progressSteps.map((step, index) => (
          <li class={`relative pr-28  last:pr-0`}>
            <div
              class="absolute inset-0 -z-10 flex items-center"
              aria-hidden="true"
            >
              <div class="h-0.5 w-full bg-primary-600"></div>
            </div>
            <div
              class={`first-letter:relative flex h-5 w-5 items-center justify-center border border-primary-600 rounded-full shadow-lg
            ${currentStep < step.step ? "bg-secondary" : "bg-primary-600"} `}
            >
              <Typography
                size="small/normal"
                className="absolute bottom-6 capitalize text-center w-20"
              >
                {step.title}
              </Typography>

              <svg
                class={`h-5 w-5 ${
                  currentStep < step.step
                    ? "text-app-primary-700"
                    : "text-secondary"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default UserCreationProgress;
