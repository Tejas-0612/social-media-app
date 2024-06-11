import { INotification } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import NotificationCard from "@/components/shared/NotificationCard";
import { useGetUserNotifications } from "@/lib/react-query/queriesAndMutations";

const Notifications = () => {
  const { user } = useUserContext();
  const { data: notifications, isSuccess } = useGetUserNotifications(user.id);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-7xl flex-start flex-col gap-3 justify-start w-full">
          <h2 className="page-title">
            <img
              src={"/assets/icons/notification.svg"}
              width={36}
              height={36}
            />
            Notifications
          </h2>

          {isSuccess &&
            notifications.data.map((notification: INotification) => (
              <NotificationCard
                key={notification._id}
                message={notification.message}
                read={notification.read}
                createdAt={notification.createdAt}
                type={notification.type}
                user={notification.user}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
