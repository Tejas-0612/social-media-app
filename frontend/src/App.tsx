import "./globals.css";
import { Route, Routes } from "react-router-dom";

import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignUpForm from "./_auth/forms/SignUpForm";
import SignInForm from "./_auth/forms/SignInForm";

import Home from "./_root/pages/Home";
import AllUsers from "./_root/pages/AllUsers";
import AllGroups from "./_root/pages/AllGroups";
import CreatePost from "./_root/pages/CreatePost";
import EditPost from "./_root/pages/EditPost";
import Profile from "./_root/pages/Profile";
import UpdateProfile from "./_root/pages/UpdateProfile";
import Explore from "./_root/pages/Explore";
import Notifications from "./_root/pages/Notifications";
import Saved from "./_root/pages/Saved";
import Group from "./_root/pages/GroupProfile";
import PostDetails from "./_root/pages/PostDetails";

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public Routes  */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route />
        </Route>

        {/* Private Routes  */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit/:postId" element={<EditPost />} />
          <Route path="/post/:postId" element={<PostDetails />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/update-profile/:userId" element={<UpdateProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/all-groups" element={<AllGroups />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/group/:groupId" element={<Group />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
