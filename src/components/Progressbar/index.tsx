import Typography from "@components/Typography";

const Progressbar = ({ status }: { status: string }) => {
  const progressSteps = [
    { step: 1, stepText: "ordered", title: "Order Placed" },
    { step: 2, stepText: "awaiting", title: "Pending Approval" },
    { step: 3, stepText: "canceled", title: "Canceled" },
    {
      step: 4,
      stepText: "captured",
      stepSubText: "not_fulfilled",
      title: "Approved",
    },
    {
      step: 5,
      stepText: "fulfilled",
      stepSubText: "partially_fulfilled",
      title: "Issued",
    },
    { step: 6, stepText: "requested", title: "Return Initiated" },
    { step: 7, stepText: "received", title: "Returned" },
  ];

  const currentStep = progressSteps.find(
    (val) => val.stepText === status || val.stepSubText === status
  )?.step;

  return (
    <div className="w-full flex items-center justify-center mt-8 py-4 relative">
      <ol role="list" class="flex items-center">
        {status !== "canceled"
          ? progressSteps.map((step, index) => (
              <li
                class={`relative pr-8 max-[321px]:pr-7  last:pr-0 ${
                  step.stepText !== "canceled" ? "block" : "hidden"
                }`}
              >
                <div
                  class="absolute inset-0 -z-10 flex items-center"
                  aria-hidden="true"
                >
                  <div class="h-0.5 w-full bg-primary-600"></div>
                </div>
                <div
                  class={`first-letter:relative flex h-6 w-6 items-center justify-center border border-primary-600 rounded-full shadow-lg
            ${currentStep < step.step ? "bg-secondray" : "bg-primary-600"} `}
                >
                  <Typography
                    size="small/normal"
                    className="absolute bottom-6 capitalize"
                  >
                    {step.title}
                  </Typography>

                  <svg
                    class={`h-5 w-5 ${
                      currentStep < step.step
                        ? "text-app-primary-700"
                        : "text-secondray"
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
            ))
          : // if Cancel status
            progressSteps.slice(0, 3).map((step, index) => (
              <li class={`relative pr-10 last:pr-0 `}>
                <div
                  class="absolute inset-0 -z-10 flex items-center"
                  aria-hidden="true"
                >
                  <div class="h-0.5 w-full bg-primary-600"></div>
                </div>
                <div
                  class={`first-letter:relative flex h-6 w-6 items-center justify-center border
                   border-primary-600 rounded-full shadow-lg ${
                     currentStep < step.step ? "bg-secondray" : "bg-primary-600"
                   }
                    ${
                      step.stepText === "canceled"
                        ? "!bg-danger-600 !border-danger-600"
                        : ""
                    }  hover:bg-primary-900`}
                >
                  <Typography
                    size="small/normal"
                    className="absolute bottom-6 capitalize"
                  >
                    {step.title}
                  </Typography>
                  {step.stepText !== "canceled" ? (
                    <svg
                      class={`h-5 w-5 ${
                        currentStep < step.step
                          ? "text-app-primary-700"
                          : "text-secondray"
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
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class={`h-5 w-5 ${
                        currentStep < step.step
                          ? "text-app-primary-700"
                          : "text-secondray"
                      }`}
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
              </li>
            ))}
      </ol>
    </div>
  );
};

export default Progressbar;
