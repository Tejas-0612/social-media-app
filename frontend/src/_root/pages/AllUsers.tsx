import { useGetAllUsers } from "@/lib/react-query/queriesAndMutations";

import { IUsers } from "@/types";
import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useUserContext } from "@/context/AuthContext";

const AllUsers = () => {
  const {
    data: creators,
    isLoading: isCreators,
    isError: isErrorCreators,
  } = useGetAllUsers();

  const { user: currentUser, isLoading: isUserLoading } = useUserContext();

  if (isErrorCreators) {
    return <Loader />;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="page-title flex gap-2 invert-white">
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
                  <li key={creator._id} className="flex-1 min-w-[200px] w-full">
                    <UserCard user={creator} currentUserId={currentUser.id} />
                  </li>
                ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
