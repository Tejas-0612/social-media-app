import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            width={150}
            height={325}
          />
        </Link>

        <div className="flex">
          <Button
            variant="ghost"
            className="shad-button_ghost px-2"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>

          <Link to={"/notifications"} className="py-2 px-2">
            <img
              src="/assets/icons/notification.svg"
              alt="logout"
              className="w-6 h-6"
            />
          </Link>

          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full mx-2"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
