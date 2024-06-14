import { IPost } from "@/types";
import PostStats from "./PostStats";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

type GridTextListProps = {
  posts: Array<IPost>;
  showUser?: boolean;
  showStats?: boolean;
};

const GridTextPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridTextListProps) => {
  const { user } = useUserContext();

  return posts.length == 0 ? (
    <p>No posts to show</p>
  ) : (
    <ul className="grid-container">
      {posts
        .filter((post) => post.type == "text")
        .map((post) => {
          console.log(post);
          return (
            <li key={post._id} className="relative min-w-40 h-40">
              <Link to={`/post/${post._id}`} className="">
                <div
                  className={`grid-post_link small-medium lg:base-medium flex flex-col items-center ${
                    showUser || showStats ? "py-8" : "justify-center"
                  }`}
                >
                  <p>
                    {post.content.substring(0, 36)}{" "}
                    {post.content.length > 36 && "..."}
                  </p>
                  <ul className="flex gap-1 mt-2">
                    {post.hashtags
                      .slice(0, 3)
                      .map((tag: string, index: number) => (
                        <li
                          key={`${tag}${index}`}
                          className="text-light-3 small-regular"
                        >
                          #{tag}
                        </li>
                      ))}
                  </ul>
                </div>
              </Link>

              <div className="grid-post_user2">
                {showUser && (
                  <div className="flex items-center justify-start gap-2 flex-1">
                    <img
                      src={
                        post.authorId.avatar.url ||
                        "/assets/icons/profile-placeholder.svg"
                      }
                      alt="creator"
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="line-clamp-1">{post.authorId.username}</p>
                  </div>
                )}
                {showStats && <PostStats post={post} userId={user.id} />}
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default GridTextPostList;
