import React from "react";
import { IoPersonAddOutline } from "react-icons/io5";

import SingleUser from "../home/SingleUser";

export default function SuggestedUser() {
  return (
    <div>
      <div className="bg-[#1A1A1A] rounded-lg p-4">
        <h3 className="font-semibold text-sm mb-4">Suggested For You</h3>
        <div className="space-y-4">
          {/* Suggested User 1 */}
          <>
            <SingleUser
              firstName={"Prakash"}
              lastName={"Sharma"}
              role={"Teacher"}
            />
          </>

          {/* Suggested User 2 */}
          <>
            <SingleUser
              firstName={"Ajay"}
              lastName={"Verma"}
              role={"Student"}
            />
          </>
        </div>
      </div>
    </div>
  );
}
