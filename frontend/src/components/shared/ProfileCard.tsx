import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { IProfileCardProps } from "@/types";

const ProfileCard = ({
  username,
  _id,
  avatar,
  fullname,
  followers,
  admin,
  currentUserId,
  type,
}: IProfileCardProps) => {
  // group
  const isMember = followers?.includes(currentUserId);
  const isAdmin = admin?._id === currentUserId;
  const isJoined = isMember || isAdmin;

  // user
  const isUserCard = type === "user";
  const isFollowing = followers?.includes(currentUserId);

  return (
    <Link
      to={`${isUserCard ? `/profile/${_id}` : `/group/${_id}`}`}
      className="profile-card"
    >
      <img
        src={avatar?.url || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="profile-card-img"
      />

      <div className="profile-card-info">
        <p className="base-medium text-light-1">{fullname}</p>

        <p className="small-regular text-light-3">
          {username ? `@${username}` : `${followers?.length} members`}
        </p>
      </div>

      <Link to={isUserCard ? `/profile/${_id}` : `/group/profile/${_id}`}>
        <Button
          type="button"
          size="sm"
          className={`${
            isFollowing || isJoined || isAdmin
              ? `shad-button_dark_4 ring-2 ring-primary-600`
              : `shad-button_primary px-5`
          } `}
        >
          {isUserCard
            ? isFollowing
              ? "Following"
              : "Follow"
            : isAdmin
            ? "Admin"
            : isJoined
            ? "Joined"
            : "Join"}
        </Button>
      </Link>
    </Link>
  );
};

export default ProfileCard;
