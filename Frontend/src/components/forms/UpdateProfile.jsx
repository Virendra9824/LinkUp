import React from "react";
import RegisterUpdateForm from "./RegisterUpdateForm";

export default function UpdateProfile() {
  let profileImage="https://wallpapers.com/images/hd/butterfly-profile-pictures-2728-x-1740-a336o37x2qaoa0t3.jpg "
  return (
    <div className="min-h-screen py-8">
      <RegisterUpdateForm
        isUpdateForm={true}
        firstName={"Aman"}
        lastName={"Joshi"}
        location={"Pali"}
        occupation={"Student"}
        profilePic={profileImage}
        email={"aman@gmail.com"}
        password={"pass"}
        confirmPassword={"pass"}
        otp={123}
      />
    </div>
  );
}