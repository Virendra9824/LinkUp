import React from "react";
import SendOtpFrom from "../components/forms/SendOtpSignin";

export default function FirstView() {
  return (
    <div className="w-[90%] lg:pb-5 pb-3 lg:pt-8 pt-4   border-4 border-emerald-600 mx-auto flex  lg:flex-row flex-col justify-between gap-8 min-h-screen">
      <div className="lg:w-[30%] w-full">
      
      


      </div>
      <div className="flex flex-col gap-y-4 lg:w-[40%] w-full">
      <SendOtpFrom/>

      </div>
      <div className="lg:w-[30%] w-full">
      </div>
    </div>
  );
}
