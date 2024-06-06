import { Link } from "react-router-dom";

import { Button } from "../ui/button";

const DisplayCard = ({
  _id,
  name,
  username = "",
  avatar,
  members = "",
  type,
}: {
  _id: String;
  username?: String;
  avatar: string;
  name: String;
  type: String;
  members?: String;
}) => {
  const isCreator = type === "creator";
  const memberCount = members.length;
  const memberText = memberCount > 1 ? "members" : "member";

  return (
    <div className="display-container">
      <div className="flex items-center my-4">
        <img src={avatar} alt="user-profile" className="display-card-img" />
        <div>
          <p className="text-lg font-semibold">{name}</p>

          <p className="text-light-3 small-regular">
            {isCreator ? `@${username}` : `${memberCount} ${memberText}`}
          </p>
        </div>
      </div>

      <Link to={`${isCreator ? `/user/profile/${_id}` : `/group/join/${_id}`}`}>
        <Button className="display-btn">{`${
          isCreator ? "View" : "Join"
        }`}</Button>
      </Link>
    </div>
  );
};

export default DisplayCard;
