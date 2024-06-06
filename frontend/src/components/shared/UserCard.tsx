import { Link } from "react-router-dom";

import { IUsers } from "@/types";
import { Button } from "../ui/button";

const UserCard = ({
  user,
  currentUserId,
}: {
  user: IUsers;
  currentUserId: string;
}) => {
  return (
    <Link to={`/profile/${user._id}`} className="user-card">
      <img
        src={user.avatar?.url || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="user-card-img"
      />

      <div className="user-card-info">
        <p className="base-medium text-light-1">{user.fullname}</p>
        <p className="small-regular text-light-3">@{user.username}</p>
      </div>

      <Link to={`/profile/${user._id}`}>
        {user.followers.includes(currentUserId) ? (
          <Button type="button" size="sm" className="shad-button_dark_4">
            Following
          </Button>
        ) : (
          <Button type="button" size="sm" className="shad-button_primary px-5">
            Follow
          </Button>
        )}
      </Link>
    </Link>
  );
};

export default UserCard;
