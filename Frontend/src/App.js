import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import UpdateProfile from "./components/forms/UpdateProfile";
import SignUpForm from "./pages/SignUpForm";
import Login from "./pages/Login";
import DeleteAccount from "./components/forms/DeleteAccount";
import UpdatePassword from "./components/forms/UpdatePassword";
import Notification from "./pages/Notification";

export default function App() {
  return (
    <div className="w-screen  min-h-screen bg-[#0A0A0A] text-white ">
      <Header />
      <div className="pt-20">
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/chat"} element={<Chat />} />
          <Route path={"/notification"} element={<Notification />} />
          <Route path={"/auth/update-profile"} element={<UpdateProfile />} />
          <Route path={"/auth/update-password"} element={<UpdatePassword />} />
          <Route path={"/auth/delete-account"} element={<DeleteAccount />} />
          <Route path={"/auth/signup"} element={<SignUpForm />} />
          <Route path={"/auth/login"} element={<Login />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
