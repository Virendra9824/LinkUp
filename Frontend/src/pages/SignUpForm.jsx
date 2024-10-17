import React from "react";
import RegisterUpdateForm from "../components/forms/RegisterUpdateForm";

export default function SignUpForm() {
  return (
    <div className="min-h-screen py-8">
      <RegisterUpdateForm
        isUpdateForm={false}
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
