import { useParams } from "react-router-dom";

import {
  useGetUserById,
  useGetUserPosts,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import ProfileActions from "@/components/shared/ProfileActions";
import ProfilePosts from "@/components/shared/ProfilePosts";
import ProfileInfo from "@/components/shared/ProfileInfo";

const Profile = () => {
  const { userId } = useParams();

  const { data: user, isPending: isUserPending } = useGetUserById(userId || "");
  const { data: posts, isPending: isPostsPending } = useGetUserPosts(userId!);

  if (!user && isUserPending) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="profile-info">
          <ProfileInfo user={user} postLength={posts.data.length} />

          <ProfileActions user={user} userId={userId!} />
        </div>
      </div>

      <ProfilePosts
        userId={userId}
        posts={posts.data}
        isPostsPending={isPostsPending}
      />
    </div>
  );
};

export default Profile;
