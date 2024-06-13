import Groupform from "../forms/Groupform";

const CreateGroup = () => {
  return (
    <div className="bg-dark-2 common-container  overflow-scroll custom-scrollbar">
      <div className="max-w-5xl flex-start gap-3 justify-start w-full">
        <img src="/assets/icons/group.svg" width={36} height={36} alt="add" />
        <h2 className="h3-bold md:h3-bold text-left w-full">Create Group</h2>
      </div>
      <Groupform action="create" />
    </div>
  );
};

export default CreateGroup;
