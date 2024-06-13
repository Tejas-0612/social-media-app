import Loader from "./Loader";
import { IPost, userDetails } from "@/types";
import PostCard from "./PostCard";
import { UserCard } from "./UserStats";
import { useGetGroupPosts } from "@/lib/react-query/queriesAndMutations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GroupPostsProps = {
  groupId: string;
  members: Array<userDetails>;
};

const GroupPosts = ({ groupId, members }: GroupPostsProps) => {
  const { data: posts, isPending: isPostsPending } = useGetGroupPosts(groupId!);

  return (
    <Tabs
      defaultValue="post"
      className="w-full px-4 rounded-xl border-2 border-dark-3"
    >
      <TabsList className="profile-tabs-list">
        <TabsTrigger value="post" className="profile-tabs-trigger ">
          <img
            src={"/assets/icons/posts.svg"}
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </TabsTrigger>
        <TabsTrigger value="members" className="profile-tabs-trigger">
          <img
            src={"/assets/icons/people.svg"}
            alt="like"
            width={20}
            height={20}
          />
          Members
        </TabsTrigger>
      </TabsList>
      <TabsContent value="post">
        {isPostsPending && !posts ? (
          <Loader />
        ) : (
          <ul className="flex flex-col flex-1 gap-9 w-full ">
            {posts &&
              posts.data.map((post: IPost) => (
                <li key={post._id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
          </ul>
        )}
      </TabsContent>
      <TabsContent value="members" className="w-full flex flex-col mx-24">
        <UserCard users={members} />
      </TabsContent>
    </Tabs>
  );
};

export default GroupPosts;
