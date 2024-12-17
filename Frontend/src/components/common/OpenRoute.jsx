// OpenRoute's purpose is to prevent the user from accessing the Login and Signup Route if he has been already authenticated and redirect him to the dashboard.
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  if (token == null) {
    return children;
  } else {
    return <Navigate to={"/"} />;
  }
}

export default OpenRoute;
