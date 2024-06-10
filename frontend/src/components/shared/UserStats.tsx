import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userDetails } from "@/types";
import { Link } from "react-router-dom";

type userStatsProps = {
  followers: Array<userDetails>;
  following: Array<userDetails>;
};

const UserCard = ({ users }: { users: Array<userDetails> }) => {
  return users.length == 0 ? (
    <>No users </>
  ) : (
    users.map((user) => (
      <Link to={`/profile/${user._id}`} key={user._id}>
        <div className="flex gap-3 items-center">
          <img src={user.avatar.url} width={40} height={40} />
          <p>{user.username}</p>
        </div>
      </Link>
    ))
  );
};

const UserStats = ({ followers, following }: userStatsProps) => {
  return (
    <div>
      <Tabs defaultValue="followers" className="w-[400px] ">
        <TabsList className="profile-tabs-list   rounded-lg">
          <TabsTrigger value="followers" className=" profile-tabs-trigger">
            Followers
          </TabsTrigger>
          <TabsTrigger value="following" className="profile-tabs-trigger">
            Following
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers">
          <UserCard users={followers} />
        </TabsContent>
        <TabsContent value="following">
          <UserCard users={following} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserStats;
