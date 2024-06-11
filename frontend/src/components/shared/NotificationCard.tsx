import { multiFormatDateString } from "@/lib/utils";
import { INotification } from "@/types";

const NotificationCard = ({
  message,
  type,
  read,
  createdAt,
}: INotification) => {
  let image;
  switch (type) {
    case "follow | mention":
      image = "user";
      break;
    case "like":
      image = "like";
      break;
    case "comment":
      image = "comment";
      break;
    case "mention":
      image = "people";
      break;
    default:
      break;
  }

  return (
    <div className="w-full ">
      <div className="w-[80%] border-b-2 border-white border-opacity-10 flex gap-4     py-4 px-6">
        <img
          src={`/assets/icons/${image}.svg`}
          width={40}
          height={36}
          className="bg-dark-4 p-[10px] rounded-full"
        />
        <div className="w-[80%] flex gap-2 items-center ">
          <div className="flex flex-col">
            <p className="base-semibold">{message}</p>
            <p className="tiny-medium text-primary-500 opacity-70">
              {multiFormatDateString(createdAt)}
            </p>
          </div>
        </div>
        <p className="tiny-medium my-4">{read ? "🔴" : "🟢"}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
