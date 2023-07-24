import Typography from "@components/Typography";
import request_return_icon from "@assets/return_request.png";
import return_icon from "@assets/return.png";
import { Link } from "preact-router/match";

const ActivityCard = () => {
  const activities = [
    {
      title: "Create Requests",
      icon: request_return_icon,
      link: "#",
    },
    {
      title: "Return",
      icon: return_icon,
      link: "#",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center bg-primary-700 p-4 rounded-md">
      <Typography className="text-white">Choose Activity</Typography>
      <div className="flex flex-wrap justify-center items-center gap-4 mt-3 ">
        {activities?.map((activity, index) => (
          <Link
            key={index}
            href={activity.link}
            className="flex items-center gap-2 bg-white p-2 rounded-lg "
          >
            <img src={activity.icon} alt={activity.title} />
            <Typography>{activity.title}</Typography>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ActivityCard;
