import { useParams } from "react-router-dom";

import GroupActions from "@/components/shared/GroupActions";
import GroupPosts from "@/components/shared/GroupPosts";
import { useGetGroupById } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import StatBlock from "@/components/shared/StatBlock";

const Group = () => {
  const { groupId } = useParams();
  const { data: groupInfo, isSuccess, isPending } = useGetGroupById(groupId!);

  if (isPending) {
    return <Loader />;
  }

  const { avatar, coverImage, name, description, members, posts, admin } =
    groupInfo?.data;

  return (
    isSuccess && (
      <div className="flex flex-1">
        <div className="profile-container">
          {/* GROUP INFO */}
          <div className="profile-inner_container">
            <div className="w-full text-center lg:text-left">
              <div className="relative">
                <img
                  src={coverImage.url}
                  alt="cover-image"
                  className="w-full h-48 rounded-t-lg"
                />
                <img src={avatar.url} alt="profile" className="group-avatar" />
              </div>
              <div className="group-info">
                <div>
                  <p className="h2-bold">{name}</p>
                  <p className="text-light-3">{description}</p>

                  <div className="flex space-x-8 mt-4">
                    <StatBlock label="Member" value={members.length} />
                    <StatBlock label="Post" value={posts.length} />
                  </div>
                </div>
                <div className="group-info-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={
                        admin?.avatar?.url ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt="Admin"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-bold">{admin.username}</span>
                  </div>

                  <GroupActions group={groupInfo.data} />
                </div>
              </div>
            </div>
          </div>

          {/* GROUP POSTS */}
          <div className="profile-inner_container">
            <GroupPosts groupId={groupId!} members={members} />
          </div>
        </div>
      </div>
    )
  );
};

export default Group;
