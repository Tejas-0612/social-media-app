import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Postform from "../forms/Postform";

const CreateGroupPost = ({ groupId }: { groupId: string }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="relative inline-block cursor-pointer">
          <img
            src="/assets/icons/add-post.svg"
            className="block w-10 md:w-12 h-10 md:h-12 bg-primary-500 rounded-full p-2"
          />
          <p className="w-28 hidden md:block absolute bottom-0 md:bottom-6 right-1 bg-dark-4 rounded-md bg-opacity-70 text-primary-500 text-left py-2 opacity-0 transition-opacity duration-300 hover:opacity-100">
            Create a post
          </p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[85%] max-w-4xl overflow-scroll custom-scrollbar bg-dark-2">
        <div className="bg-dark-2 common-container  overflow-scroll custom-scrollbar">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img
              src="/assets/icons/add-post.svg"
              width={36}
              height={36}
              alt="add"
            />
            <h2 className="h3-bold md:h3-bold text-left w-full">
              Create Group Post
            </h2>
          </div>
          <Postform action="create" group={groupId} />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateGroupPost;
