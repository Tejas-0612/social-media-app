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
          <Route path="/all-groups" element={<AllGroups />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
}

export default App;
