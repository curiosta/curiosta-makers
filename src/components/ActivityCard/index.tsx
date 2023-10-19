import Typography from "@components/Typography";
import request_icon from "@assets/request.svg";
import return_icon from "@assets/return.svg";
import fulfil_icon from "@assets/fulfil.svg";
import inbound_icon from "@assets/inbound.svg";
import issue_inventory_icon from "@assets/issue-inventory.svg";
import add_user_icon from "@assets/add-user.svg";
import { Link } from "preact-router/match";
import { isUser } from "@/store/userState";

const ActivityCard = () => {
  const activities = [
    {
      title: "Create Requests",
      icon: request_icon,
      link: "/create-requests",
    },
    {
      title: "Return",
      icon: return_icon,
      link: "/return",
    },
    {
      title: "Add Inventory",
      icon: inbound_icon,
      link: "/material-master/add",
    },
    {
      title: "Fulfill",
      icon: fulfil_icon,
      link: "/fulfill",
    },
    {
      title: "Requests",
      icon: request_icon,
      link: "/orders",
    },
    {
      title: "Issue Inventory",
      icon: issue_inventory_icon,
      link: "/create-draft-order",
    },
    {
      title: "Add User",
      icon: add_user_icon,
      link: "/add-user",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <Typography className="w-full">Quick Actions</Typography>
      <div className="flex flex-wrap justify-center items-center gap-4 my-3 ">
        {isUser.value
          ? activities?.slice(0, 2).map((activity, index) => (
              <Link
                key={index}
                href={activity.link}
                className="flex flex-col items-center gap-2"
              >
                <img
                  src={activity.icon}
                  alt={activity.title}
                  className="bg-primary-600/20 p-2 rounded-2xl w-16 h-16"
                />
                <Typography>{activity.title}</Typography>
              </Link>
            ))
          : activities?.slice(1).map((activity, index) => (
              <Link
                key={index}
                href={activity.link}
                className="flex flex-col items-center gap-2"
              >
                <img
                  src={activity.icon}
                  alt={activity.title}
                  className="bg-primary-600/20 p-2 rounded-2xl w-16 h-16"
                />
                <Typography>{activity.title}</Typography>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default ActivityCard;
