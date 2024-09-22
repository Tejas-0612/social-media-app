import { Link } from "react-router-dom";

import { profileUser } from "@/types";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useToggleFollowUser } from "@/lib/react-query/queriesAndMutations";
import { toast } from "../ui/use-toast";

type ProfileActionsProps = {
  user: profileUser;
  userId: string;
};

const ProfileActions = ({ user, userId }: ProfileActionsProps) => {
  const { user: currentUser } = useUserContext();

  const isFollower = user.followers.some(
    (follower: { _id: string }) => follower._id == currentUser.id
  );

  const { mutateAsync: toggleFollowUser, isPending } = useToggleFollowUser();

  const ToggleFollowUser = async ({
    userId,
    type,
  }: {
    userId: string;
    type: string;
  }) => {
    try {
      const response = await toggleFollowUser(userId);

      if (!isPending && response.success) {
        toast({ title: `${type} User` });
      }
    } catch (error: any) {
      toast({ title: error.response.data.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <div className={`${user._id !== currentUser.id && "hidden"}`}>
        <Link
          to={`/update-profile/${user._id}`}
          className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
            user._id !== currentUser.id && "hidden"
          }`}
        >
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
          <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
        </Link>
      </div>
      <div className={`${currentUser.id === userId && "hidden"}`}>
        <Button
          type="button"
          className={`${
            isFollower
              ? "shad-button_dark_4 ring-1 ring-primary-600"
              : "shad-button_primary"
          } px-8`}
          onClick={() =>
            ToggleFollowUser({
              userId,
              type: `${isFollower ? "UnFollow" : "Following"}`,
            })
          }
        >
          {isFollower ? "Following" : "Follow"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileActions;
