import Storyform from "../forms/Storyform";

type StoryFormProps = {
  closeDialog: () => void;
};
const CreateStory = ({ closeDialog }: StoryFormProps) => {
  return (
    <div className="bg-dark-2 common-container overflow-scroll custom-scrollbar">
      <div className="max-w-5xl flex-start gap-3 justify-start w-full">
        <img src="/assets/icons/story.svg" width={42} height={42} alt="add" />
        <h2 className="h3-bold md:h3-bold text-left w-full">Create Story</h2>
      </div>
      <Storyform action="create" closeDialog={closeDialog} />
    </div>
  );
};

export default CreateStory;
