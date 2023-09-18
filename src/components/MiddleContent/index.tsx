import master_icon from "@assets/master.svg";
import inventory_icon from "@assets/inventory.svg";
import report_icon from "@assets/report.svg";
import { Link } from "preact-router";
import Typography from "../Typography";

const MiddleContent = () => {
  const MiddleContents = [
    {
      title: "Master",
      icon: master_icon,
      link: "/master",
    },
    // {
    //   title: "Inventory",
    //   icon: inventory_icon,
    //   link: "#",
    // },
    // {
    //   title: "Report",
    //   icon: report_icon,
    //   link: "#",
    // },
  ];

  return (
    <div className="flex flex-col items-center bg-primary-600/10 p-4 px-8 rounded-2xl my-4">
      <div className="flex flex-wrap justify-center items-center gap-4  ">
        {MiddleContents.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="flex flex-col items-center p-2 "
          >
            <img src={item.icon} alt={item.title} />
            <Typography>{item.title}</Typography>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MiddleContent;
