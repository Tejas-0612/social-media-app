import { useGetAllStories } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";
import { IStory } from "@/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import CreateStory from "./CreateStory";
import { useState } from "react";
import StoryViewer from "./StoryViewer";

const StoryFeed = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);
  const [initialUserIndex, setInitialUserIndex] = useState<number | null>(null);
  const { data: Stories, isPending: isStoriesPending } = useGetAllStories();

  if (isStoriesPending) {
    return <Loader />;
  }

  console.log(Stories);

  return (
    <div className="w-[670px] mt-8 flex space-x-4 mx-auto overflow-x-auto hidden-scrollbar">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger>
          <div className="w-[80px] h-[80px]  rounded-full shadow-md">
            <img
              src={"/assets/icons/create.svg"}
              alt="creator"
              className="w-full h-full rounded-full opacity-80"
            />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-h-[85%] max-w-4xl overflow-scroll custom-scrollbar bg-dark-2">
          <CreateStory closeDialog={() => setIsDialogOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>

      {!isStoriesPending &&
        Stories.map((story: IStory, index: number) => (
          <div
            key={story._id}
            className="flex flex-col items-center space-y-1 cursor-pointer"
            onClick={() => {
              setInitialUserIndex(index);
              setOpenViewer(true);
            }}
          >
            <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md">
              <img
                src={story?.user?.avatar.url}
                alt={story.user.fullname}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <p className="text-xs text-center truncate w-16 text-white">
              {story.user.username}
            </p>
          </div>
        ))}

      {openViewer && initialUserIndex !== null && (
        <StoryViewer storyData={Stories} onClose={() => setOpenViewer(false)} />
      )}
    </div>
  );
};

export default StoryFeed;
