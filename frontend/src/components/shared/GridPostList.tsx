import { Link } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { IPost } from "@/types";
import PostStats from "./PostStats";

type GridPostListProps = {
  posts: Array<IPost>;
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return posts.length == 0 ? (
    <p>No posts to show</p>
  ) : (
    <ul className="grid-container">
      {posts
        .filter((post) => post.imageUrl)
        .map((post) => (
          <li key={post._id} className="relative min-w-80 h-80">
            <Link to={`/posts/${post._id}`} className="grid-post_link">
              <img
                src={post?.imageUrl}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={
                      post.authorId?.avatar?.url ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-8 h-8 rounded-full"
                  />
                  {/* <p className="line-clamp-1 small-regular">
                    {post.authorId.username}
                  </p> */}
                </div>
              )}
              {showStats && <PostStats post={post} userId={user.id} />}
            </div>
          </li>
        ))}
    </ul>
  );
};

export default GridPostList;
