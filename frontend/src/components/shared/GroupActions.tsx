import { IGroup } from "@/types";
import EditGroup from "./EditGroup";

import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import {
  useExitGroup,
  useJoinGroup,
} from "@/lib/react-query/queriesAndMutations";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUserContext } from "@/context/AuthContext";

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
        <AlertDialog>
          <AlertDialogTrigger className="h-12 px-5 flex-center gap-2 rounded-lg bg-dark-4 text-light-1">
            <img
              src={"/assets/icons/edit.svg"}
              alt="edit"
              width={20}
              height={20}
            />
            <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-h-[85%] max-w-4xl overflow-scroll custom-scrollbar bg-dark-2">
            <EditGroup />
          </AlertDialogContent>
        </AlertDialog>
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
