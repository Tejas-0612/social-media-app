import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { IPost } from "@/types";
import { toast } from "../ui/use-toast";
import {
  useTogglePostLike,
  useGetPostLikes,
} from "@/lib/react-query/queriesAndMutations";

type PostStatsProps = {
  post: IPost;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();

  const { data: postLikes, isFetched: isLikesFetched } = useGetPostLikes(
    post._id
  );

  const [likes, setLikes] = useState<string[]>([]);

  const { mutate: toggleLikePost } = useTogglePostLike();

  useEffect(() => {
    if (isLikesFetched && postLikes) {
      setLikes(postLikes.data.map((like: any) => like.userId));
    }
  }, [postLikes, isLikesFetched]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    toggleLikePost({ postId: post._id });
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`/post/:${post._id}`);

    toast({ title: "link copied to clipboard" });
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex gap-2">
        <div className="flex gap-2 mr-5">
          <img
            src={`${
              likes.includes(userId)
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }`}
            alt="like"
            width={20}
            height={20}
            onClick={(e) => handleLikePost(e)}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>

        <div className="flex gap-2 mr-5">
          <img
            src={"/assets/icons/comment.svg"}
            alt="comment"
            width={20}
            height={20}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">
            {post?.comments?.length}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mr-5">
        <img
          src={"/assets/icons/share.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleShare}
        />
      </div>
    </div>
  );
};

export default PostStats;
