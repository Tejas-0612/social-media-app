import { IGroup } from "@/types";
import EditGroup from "./EditGroup";

import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import {
  useDeleteGroup,
  useExitGroup,
  useJoinGroup,
} from "@/lib/react-query/queriesAndMutations";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUserContext } from "@/context/AuthContext";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { useNavigate } from "react-router-dom";

const GroupActions = ({ group }: { group: IGroup }) => {
  const navigate = useNavigate();

  const { user: currentUser } = useUserContext();
  const { mutateAsync: joinGroup } = useJoinGroup();
  const { mutateAsync: exitGroup } = useExitGroup();
  const { mutateAsync: deleteGroup } = useDeleteGroup();

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

  const handleDeleteGroup = async () => {
    try {
      const response = await deleteGroup(group._id);
      if (response) {
        toast({ title: `Deleted group '${group.name}' successfully` });
      }
      navigate(-1);
    } catch (error) {
      toast({ title: "error while deleting a group" });
      throw error;
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <div
        className={`${
          currentUser.id !== group.admin._id && "hidden"
        } flex gap-2 items-center`}
      >
        <AlertDialog>
          <AlertDialogTrigger className="group-action-btn hover:ring-primary-500 ">
            <img
              src={"/assets/icons/edit.svg"}
              alt="edit"
              width={20}
              height={20}
            />
          </AlertDialogTrigger>
          <AlertDialogContent className="max-h-[85%] max-w-4xl overflow-scroll custom-scrollbar bg-dark-2">
            <EditGroup />
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger className="group-action-btn hover:ring-red-400">
            <img
              src={"/assets/icons/delete.svg"}
              alt="edit"
              width={20}
              height={20}
            />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Button className="shad-button_dark_4 ring-1 ring-off-white">
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction>
                <Button
                  onClick={() => handleDeleteGroup()}
                  className="shad-button_danger"
                >
                  Yes, delete Group
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
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
