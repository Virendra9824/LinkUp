import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

export default function App() {
  return (
    <div className="w-screen  min-h-screen bg-[#0A0A0A] text-white ">
      <Header />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/chat"} element={<Chat />} />
      </Routes>
      <Footer />
    </div>
  );
}
