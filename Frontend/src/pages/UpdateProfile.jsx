import React from "react";
import RegisterUpdateForm from "../components/forms/RegisterUpdateForm";

export default function UpdateProfile() {
  return (
    <div className="min-h-screen py-8">
      <RegisterUpdateForm
        isUpdateForm={true}
        firstName={"Aman"}
        lastName={"Joshi"}
        location={"Pali"}
        occupation={"Student"}
        profilePic={"img"}
        email={"aman@gmail.com"}
        password={"pass"}
        confirmPassword={"pass"}
        otp={123}
      />
    </div>
  );
}
