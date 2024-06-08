import { Link } from "react-router-dom";

import { IPost } from "@/types";
import PostStats from "./PostStats";
import CommentCard from "./CommentCard";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

const PostCard = ({ post }: { post: IPost }) => {
  const { user } = useUserContext();

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post._id}`}>
            <img
              src={
                post.authorId.avatar?.url ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.authorId.username}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/edit/${post._id}`}
          className={`${user.id !== post.authorId._id && "hidden"}`}
        >
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/posts/${post._id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.content}</p>
          <ul className="flex gap-1 mt-2">
            {post.hashtags.map((tag: string, index: number) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        {post.imageUrl && (
          <img src={post.imageUrl} alt="post-image" className="post-card_img" />
        )}
      </Link>

      <PostStats post={post} userId={user.id} />

      <CommentCard post={post} userImg={user.imageUrl} />
    </div>
  );
};

export default PostCard;
