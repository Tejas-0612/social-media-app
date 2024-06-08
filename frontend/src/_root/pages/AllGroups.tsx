import { IGroups } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import { useGetAllGroups } from "@/lib/react-query/queriesAndMutations";

import Loader from "@/components/shared/Loader";
import { toast } from "@/components/ui/use-toast";
import ProfileCard from "@/components/shared/ProfileCard";

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
    });
  }

  return (
    <div className="common-container">
      <div className="profile-container">
        <h2 className="page-title">
          <img src={"/assets/icons/group.svg"} width={36} height={36} />
          All Groups
        </h2>
        {!isGroups && !groups ? (
          <Loader />
        ) : (
          <ul className="profile-card-grid">
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
