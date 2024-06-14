import { multiFormatDateString } from "@/lib/utils";

type CommentProps = {
  user: {
    avatar: { url: string };
    username: string;
  };
  comment: string;
  time: string;
};

const CommentDetailsCard = ({ user, comment, time }: CommentProps) => {
  return (
    <div className="flex  gap-2 my-4">
      <img
        src={user?.avatar?.url || "/assets/icons/profile-placeholder.svg"}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-2">
          <p className="text-light-3 small-regular">{user.username}</p>
          <p className="small-regular xl:body-regular">{comment}</p>
        </div>
        <p className="text-light-4 tiny-medium">
          {multiFormatDateString(time)}
        </p>
      </div>
    </div>
  );
};

export default CommentDetailsCard;
