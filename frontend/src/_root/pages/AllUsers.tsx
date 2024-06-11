import { IUsers } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import { useGetAllUsers } from "@/lib/react-query/queriesAndMutations";

import Loader from "@/components/shared/Loader";
import { toast } from "@/components/ui/use-toast";
import ProfileCard from "@/components/shared/ProfileCard";

const AllUsers = () => {
  const {
    data: creators,
    isLoading: isCreators,
    isError: isErrorCreators,
  } = useGetAllUsers();

  const { user: currentUser, isLoading: isUserLoading } = useUserContext();

  if (isErrorCreators) {
    toast({
      title: "Sorry, we were unable to load the users. Please try again later.",
    });
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="page-title">
          <img src={"/assets/icons/people.svg"} width={36} height={36} />
          All Users
        </h2>
        {isCreators && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {!isUserLoading &&
              creators.data
                .filter((user: IUsers) => user._id !== currentUser.id)
                .map((creator: IUsers) => (
                  <li key={creator._id} className="profile-card-con">
                    <ProfileCard
                      username={creator.username}
                      _id={creator._id}
                      avatar={creator.avatar}
                      fullname={creator.fullname}
                      followers={creator.followers}
                      currentUserId={currentUser.id}
                      type="user"
                    />
                  </li>
                ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
