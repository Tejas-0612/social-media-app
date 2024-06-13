import { useParams } from "react-router-dom";

import Loader from "./Loader";
import Groupform from "../forms/Groupform";
import { useGetGroupById } from "@/lib/react-query/queriesAndMutations";

const EditGroup = () => {
  const { groupId } = useParams();
  const { data: group, isLoading } = useGetGroupById(groupId!);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Group</h2>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <Groupform action="update" group={group.data} />
        )}
      </div>
    </div>
  );
};

export default EditGroup;
