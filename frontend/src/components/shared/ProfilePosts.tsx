import { useParams } from "react-router-dom";
import { IPost } from "@/types";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllLikedPostsByUserId } from "@/lib/react-query/queriesAndMutations";
import GridTextPostList from "./GridTextPostList";
import { useUserContext } from "@/context/AuthContext";

type ProfilePostsProps = {
  userId: string | undefined;
  posts: Array<IPost>;
  isPostsPending: boolean;
};

const ProfilePosts = ({ posts, isPostsPending }: ProfilePostsProps) => {
  const { userId } = useParams();
  const { data: likedPosts, isPending: isLikedPostPending } =
    useGetAllLikedPostsByUserId(userId!);

  // const { user: currentUser } = useUserContext();

  return (
    <Tabs defaultValue="photo" className="w-full">
      <TabsList className="profile-tabs-list">
        <TabsTrigger value="photo" className="profile-tabs-trigger ">
          <img
            src={"/assets/icons/posts.svg"}
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </TabsTrigger>

        <TabsTrigger value="text" className="profile-tabs-trigger">
          <img
            src={"/assets/icons/text.svg"}
            alt="save"
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
      </TabsList>
      <TabsContent value="photo">
        {isPostsPending ? (
          <Loader />
        ) : (
          <GridPostList posts={posts} showStats={true} showUser={false} />
        )}
      </TabsContent>
      <TabsContent value="text">
        {isPostsPending ? (
          <Loader />
        ) : (
          <GridTextPostList posts={posts} showStats={true} showUser={false} />
        )}
      </TabsContent>
      <TabsContent value="liked">
        {isLikedPostPending ? (
          <Loader />
        ) : (
          <GridPostList
            posts={likedPosts?.data}
            showStats={true}
            showUser={false}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProfilePosts;
