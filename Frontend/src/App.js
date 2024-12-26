import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import UpdateProfile from "./components/forms/UpdateProfile";
import Login from "./pages/Login";
import DeleteAccount from "./components/forms/DeleteAccount";
import UpdatePassword from "./components/forms/UpdatePassword";
import Notification from "./pages/Notification";
import RegisterUpdateForm from "./components/forms/RegisterUpdateForm";
import { Toaster } from "react-hot-toast";
import UserDetails from "./pages/UserDetails";
import ShowPost from "./components/posts/ShowPost";
import UserSpecificPosts from "./components/posts/UserSpecificPosts";
import Error from "./pages/Error";
import OpenRoute from "./components/common/OpenRoute";
import PrivateRoute from "./components/common/PrivateRoute";
import ForgotPassword from "./components/forms/ForgotPassword";
import AboutUs from "./pages/AboutUs";

export default function App() {
  return (
    <div className="w-screen  min-h-screen bg-[#0A0A0A] text-white  ">
      <Header />
      <div className="pt-20 ">
        <Routes>
          <Route
            path={"/"}
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path={"/chat/:receiverId"}
            element={
              <PrivateRoute>
                {" "}
                <Chat />
              </PrivateRoute>
            }
          />

          <Route
            path={"/notification"}
            element={
              <PrivateRoute>
                {" "}
                <Notification />
              </PrivateRoute>
            }
          />

          <Route
            path={"/auth/update-password"}
            element={
              <PrivateRoute>
                <UpdatePassword />
              </PrivateRoute>
            }
          />

          <Route path={"/auth/reset-password"} element={<ForgotPassword />} />

          <Route path={"/about"} element={<AboutUs />} />

          <Route
            path={"/update-profile"}
            element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            }
          />

          <Route
            path={"/auth/delete-account"}
            element={
              <PrivateRoute>
                {" "}
                <DeleteAccount />
              </PrivateRoute>
            }
          />

          <Route
            path={"/auth/register"}
            element={
              <OpenRoute>
                <RegisterUpdateForm />
              </OpenRoute>
            }
          />

          <Route
            path={"/auth/login"}
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path={"/auth/signup"}
            element={
              <OpenRoute>
                <RegisterUpdateForm />
              </OpenRoute>
            }
          />

          <Route
            path={"/user/:userId"}
            element={
              <PrivateRoute>
                <UserDetails />
              </PrivateRoute>
            }
          />

          <Route
            path={"/user/:userId/posts/:postId"}
            element={
              <PrivateRoute>
                {" "}
                <UserSpecificPosts />
              </PrivateRoute>
            }
          />

          <Route path={"*"} element={<Error />} />
        </Routes>
      </div>

      <Footer />
      <Toaster />
    </div>
  );
}
