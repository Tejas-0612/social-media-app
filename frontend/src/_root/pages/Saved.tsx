import { IPost } from "@/types";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import GridTextPostList from "@/components/shared/GridTextPostList";
import { useUserSavedPosts } from "@/lib/react-query/queriesAndMutations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type savedPost = {
  post: { post: IPost };
};

const Saved = () => {
  const { data: posts, isLoading: isSavedPosts } = useUserSavedPosts();

  const PhotoPosts = posts?.data
    .filter((post: IPost) => post.type == "post")
    .map((post: savedPost) => post.post);

  const textPosts = posts?.data
    .filter((post: IPost) => post.type == "text")
    .map((post: savedPost) => post.post);

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <h2 className="page-title">
          <img
            src="/assets/icons/save.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          Saved Posts
        </h2>
      </div>

      {isSavedPosts ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {posts.data.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <Tabs defaultValue="photo" className="w-full">
              <TabsList className="profile-tabs-list">
                <TabsTrigger value="photo" className="profile-tabs-trigger">
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
                    alt="text"
                    width={20}
                    height={20}
                  />
                  Posts
                </TabsTrigger>
              </TabsList>
              <TabsContent value="photo">
                <GridPostList
                  posts={PhotoPosts}
                  showStats={true}
                  showUser={false}
                />
              </TabsContent>
              <TabsContent value="text">
                <GridTextPostList
                  posts={textPosts}
                  showStats={true}
                  showUser={false}
                />
              </TabsContent>
            </Tabs>
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
