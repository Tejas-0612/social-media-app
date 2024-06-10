import { profileUser } from "@/types";
import StatBlock from "@/components/shared/StatBlock";
import UserStats from "@/components/shared/UserStats";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ProfileInfoProps = {
  user: profileUser;
  postLength: number;
};

const ProfileInfo = ({ user, postLength }: ProfileInfoProps) => {
  return (
    <>
      <img
        src={user.avatar.url || "/assets/icons/profile-placeholder.svg"}
        alt="profile"
        className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
      />
      <div className="flex flex-col flex-1 justify-between md:mt-2">
        <div className="flex flex-col w-full">
          <h1 className="user-text h3-bold md:h1-semibold w-full">
            {user.fullname}
          </h1>
          <p className="small-regular md:body-medium text-light-3 user-text">
            @{user.username}
          </p>
        </div>

        <div className="profile-stats">
          <StatBlock label="Posts" value={postLength} />
          <AlertDialog>
            <AlertDialogTrigger className="flex gap-8">
              <StatBlock label="Followers" value={user.followers.length} />
              <StatBlock label="Following" value={user.following.length} />
            </AlertDialogTrigger>
            <AlertDialogContent className="w-80 top-[40%] bg-dark-2 min-h-[210px]">
              <UserStats
                followers={user.followers}
                following={user.following}
              />
              <AlertDialogHeader className="w-20 flex flex-row items-center">
                <AlertDialogCancel className="fixed px-2 my-1 top-0 right-2 border-0">
                  X
                </AlertDialogCancel>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="small-medium md:base-medium user-text mt-7 max-w-screen-sm">
          {user.bio}
        </p>
      </div>
    </>
  );
};

export default ProfileInfo;
