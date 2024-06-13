import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import {
  useExitGroup,
  useJoinGroup,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { IGroup } from "@/types";

const GroupActions = ({ group }: { group: IGroup }) => {
  const { user: currentUser } = useUserContext();
  const { mutateAsync: joinGroup } = useJoinGroup();
  const { mutateAsync: exitGroup } = useExitGroup();

  const isMember = group.members.some(
    (member: { _id: string }) => member._id === currentUser.id
  );

  const handleJoinGroup = async () => {
    try {
      if (!isMember) {
        const joinedGroup = await joinGroup(group._id);

        if (joinedGroup) {
          toast({ title: `${joinedGroup.message}` });
        }
      } else {
        const existedGroup = await exitGroup(group._id);

        if (existedGroup) {
          toast({ title: `${existedGroup.message}` });
        }
      }
    } catch (error: any) {
      toast({ title: error.response.data.message });
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <div className={`${currentUser.id !== group.admin._id && "hidden"}`}>
        <Link
          to={`/update-profile/${group.admin._id}`}
          className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg`}
        >
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
          <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
        </Link>
      </div>
      <div className={`${currentUser.id === group.admin._id && "hidden"}`}>
        <Button
          type="button"
          className={`${
            isMember
              ? "shad-button_dark_4 ring-1 ring-primary-600"
              : "shad-button_primary"
          }  px-8`}
          onClick={() => handleJoinGroup()}
        >
          {isMember ? "Joined" : "Join"}
        </Button>
      </div>
    </div>
  );
};

export default GroupActions;
