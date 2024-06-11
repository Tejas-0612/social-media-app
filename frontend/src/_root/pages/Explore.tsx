import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetAllPosts } from "@/lib/react-query/queriesAndMutations";

const Explore = () => {
  const { data: posts, isPending: isPostPending } = useGetAllPosts();
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start flex-col gap-3 justify-start w-full">
          <h2 className="page-title">
            <img src={"/assets/icons/wallpaper.svg"} width={36} height={36} />
            Explore
          </h2>

          {isPostPending ? (
            <Loader />
          ) : (
            <div className="my-6">
              <GridPostList
                posts={posts.data}
                showStats={true}
                showUser={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
