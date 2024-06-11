import "./globals.css";
import { Route, Routes } from "react-router-dom";

import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignUpForm from "./_auth/forms/SignUpForm";
import SignInForm from "./_auth/forms/SignInForm";

import { Toaster } from "./components/ui/toaster";
import Home from "./_root/pages/Home";
import AllUsers from "./_root/pages/AllUsers";
import AllGroups from "./_root/pages/AllGroups";
import CreatePost from "./_root/pages/CreatePost";
import EditPost from "./_root/pages/EditPost";
import Profile from "./_root/pages/Profile";
import UpdateProfile from "./_root/pages/UpdateProfile";

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
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit/:postId" element={<EditPost />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/update-profile/:userId" element={<UpdateProfile />} />
          <Route path="/all-groups" element={<AllGroups />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
}

export default App;
