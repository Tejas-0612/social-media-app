import { useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { useDeletePost } from "@/lib/react-query/queriesAndMutations";

const DeletePost = ({ postId }: { postId: string }) => {
  const navigate = useNavigate();
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();

  const handleDeletePost = async () => {
    try {
      await deletePost(postId);
      toast({ title: "Deleted post successfully" });
      navigate("/");
    } catch (error) {
      toast({ title: "Error while deleting post" });
    }
  };

  return (
    <button onClick={() => handleDeletePost()} disabled={isDeleting}>
      <img
        src={"/assets/icons/delete.svg"}
        alt="delete"
        width={20}
        height={20}
      />
    </button>
  );
};

export default DeletePost;
