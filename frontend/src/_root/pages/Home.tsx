import { Link } from "react-router-dom";

import { IGroups, IPost, IUsers } from "@/types";
import {
  useGetAllPosts,
  useGetAllUsers,
  useGetAllUserGroups,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";
import DisplayCard from "@/components/shared/DisplayCard";
import PostCard from "@/components/shared/PostCard";

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

  const { data: posts, isPending: isPostsPending } = useGetAllPosts();

  const { user } = useUserContext();

  if (isUsersLoading || isGroupsLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="page-title">
            <img src={"/assets/icons/home.svg"} width={36} height={36} />
            Home Feed
          </h2>

          {isPostsPending && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts.data.map((post: IPost) => (
                <li key={post._id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
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

          <Link to={``}>
            <img src="/assets/icons/setting.svg" className="home-icons" />
          </Link>

          <Link to={`/notifications`}>
            <img src="/assets/icons/notification.svg" className="home-icons" />
          </Link>

          <Link to={`/all-users`}>
            <img src="/assets/icons/people.svg" className="home-icons" />
          </Link>
        </div>

        <div className="home-recommended">
          <div className={`${allUserGroups?.data.length == 0 && "hidden"}`}>
            <h1 className="h4-bold">Your Groups</h1>
            <ul>
              {isGroupSuccess &&
                allUserGroups.data.map(
                  ({ _id, avatar, name, members }: IGroups) => (
                    <li key={_id}>
                      <DisplayCard
                        _id={_id}
                        avatar={avatar.url}
                        name={name}
                        type="group"
                        members={members}
                      />
                    </li>
                  )
                )}
            </ul>
          </div>

          <div>
            <h1 className="h4-bold">Top Creators</h1>
            <ul>
              {" "}
              {isSuccess &&
                allUsers.data.map(
                  ({ _id, username, avatar, fullname }: IUsers) => (
                    <li key={_id}>
                      <DisplayCard
                        _id={_id}
                        name={fullname}
                        avatar={avatar.url}
                        type="creator"
                        username={username}
                      />
                    </li>
                  )
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
