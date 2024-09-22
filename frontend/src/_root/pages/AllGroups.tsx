import { IGroups } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import { useGetAllGroups } from "@/lib/react-query/queriesAndMutations";
import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/shared/Loader";
import ProfileCard from "@/components/shared/ProfileCard";
import CreateGroup from "@/components/shared/CreateGroup";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AllGroups = () => {
  const {
    data: groups,
    isLoading: isGroups,
    isError: isErrorGroups,
  } = useGetAllGroups();

  const { user: currentUser, isLoading: isUserLoading } = useUserContext();

  if (isErrorGroups) {
    toast({
      title:
        "Sorry, we were unable to load the groups. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <div className="max-w-5xl flex-start flex-col gap-3 justify-start w-full">
          <h2 className="page-title">
            <img src={"/assets/icons/group.svg"} width={36} height={36} />
            All Groups
          </h2>
        </div>
        {!isGroups && !groups ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            <div className="profile-card">
              <AlertDialog>
                <AlertDialogTrigger>
                  <img
                    src={"/assets/icons/create.svg"}
                    alt="creator"
                    className=" rounded-full opacity-80"
                  />
                  <p className="profile-card-info small-medium text-light-3">
                    Create New Group
                  </p>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-h-[85%] max-w-4xl overflow-scroll custom-scrollbar bg-dark-2">
                  <CreateGroup />
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {!isUserLoading &&
              groups?.data.map((group: IGroups) => (
                <li key={group._id} className="profile-card-con">
                  <ProfileCard
                    _id={group._id}
                    avatar={group.avatar}
                    fullname={group.name}
                    followers={group.members}
                    admin={group.admin}
                    currentUserId={currentUser.id}
                    type="group"
                  />
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllGroups;
