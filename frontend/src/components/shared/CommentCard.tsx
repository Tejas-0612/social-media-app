import { useState } from "react";

import { IPost } from "@/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { useAddComment } from "@/lib/react-query/queriesAndMutations";

type commentCardProps = {
  post: IPost;
  userImg: string;
};

const CommentCard = ({ post, userImg }: commentCardProps) => {
  const [comment, setComment] = useState<string>("");

  const { mutateAsync: addComment, isSuccess } = useAddComment();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addComment({ postId: post._id, content: comment });

    if (isSuccess) {
      toast({ title: "Comment added successfully!" });
    }

    setComment("");
  };

  return (
    <div className="comment-card">
      <img src={userImg} alt="profile" className="" />

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          className="px-2"
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button type="submit">
          <img
            src="/assets/icons/send.svg"
            alt="profile"
            width={24}
            height={24}
          />
        </Button>
      </form>
    </div>
  );
};

export default CommentCard;
