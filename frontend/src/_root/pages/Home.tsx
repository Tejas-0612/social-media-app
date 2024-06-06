import { Link } from "react-router-dom";

import {
  useGetAllUserGroups,
  useGetAllUsers,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import DisplayCard from "@/components/shared/DisplayCard";

const Home = () => {
  const {
    data: allUsers,
    isLoading: isUsersLoading,
    isSuccess,
  } = useGetAllUsers();

  const {
    data: allUserGroups,
    isLoading: isGroupsLoading,
    isSuccess: isGroupSuccess,
  } = useGetAllUserGroups();

  const { user } = useUserContext();

  if (isUsersLoading || isGroupsLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="page-title flex gap-2 invert-white">
            <img src={"/assets/icons/home.svg"} width={36} height={36} />
            Home Feed
          </h2>
        </div>
      </div>

      <div className="home-right-con">
        <div className="home-nav">
          <Link to={`profile/${user.id}`}>
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              className="home-user-icon"
            />
          </Link>

          <Link to={`user/settings`}>
            <img src="/assets/icons/setting.svg" className="home-icons" />
          </Link>

          <Link to={`/user/${user.id}/notifications`}>
            <img src="/assets/icons/notification.svg" className="home-icons" />
          </Link>

          <Link to={`/all-users`}>
            <img src="/assets/icons/people.svg" className="home-icons" />
          </Link>
        </div>

        <div className="home-recommended">
          <div>
            <h1 className="h4-bold">Your Groups</h1>
            {isGroupSuccess &&
              allUserGroups?.data.map(({ _id, avatar, name, members }: any) => (
                <DisplayCard
                  _id={_id}
                  avatar={avatar?.url}
                  name={name}
                  type="group"
                  members={members}
                />
              ))}
          </div>

          <div>
            <h1 className="h4-bold">Top Creators</h1>
            {isSuccess &&
              allUsers?.data
                .filter((user: { avatar: string }) => user.avatar)
                .map(({ _id, username, avatar, fullname }: any) => (
                  <DisplayCard
                    _id={_id}
                    name={fullname}
                    avatar={avatar.url}
                    type="creator"
                    username={username}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
