import { IPost } from "@/types";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllLikedPostsByUserId } from "@/lib/react-query/queriesAndMutations";

type ProfilePostsProps = {
  userId: string | undefined;
  posts: Array<IPost>;
  isPostsPending: boolean;
};

const ProfilePosts = ({ userId, posts, isPostsPending }: ProfilePostsProps) => {
  const { data: likedPosts, isPending: isLikedPostPending } =
    useGetAllLikedPostsByUserId(userId!);

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="profile-tabs-list">
        <TabsTrigger value="posts" className="profile-tabs-trigger ">
          <img
            src={"/assets/icons/posts.svg"}
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </TabsTrigger>
        <TabsTrigger value="liked" className="profile-tabs-trigger">
          <img
            src={"/assets/icons/like.svg"}
            alt="like"
            width={20}
            height={20}
          />
          Liked Posts
        </TabsTrigger>
        <TabsTrigger value="saved" className="profile-tabs-trigger">
          <img
            src={"/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
          />
          Saved Posts
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        {isPostsPending ? (
          <Loader />
        ) : (
          <GridPostList posts={posts} showStats={false} showUser={false} />
        )}
      </TabsContent>
      <TabsContent value="liked">
        {isLikedPostPending ? (
          <Loader />
        ) : (
          <GridPostList
            posts={likedPosts.data}
            showStats={false}
            showUser={false}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProfilePosts;
