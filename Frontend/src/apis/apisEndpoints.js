const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

// AUTH ENDPOINTS
export const authEndpoints = {
  SEND_OTP_API_URL: BASE_URL + "/auth/send-otp",
  SIGNUP_API_URL: BASE_URL + "/auth/signup",
  LOGIN_API_URL: BASE_URL + "/auth/login",
  LOGOUT_API_URL: BASE_URL + "/auth/logout",
  DELETE_ACCOUNT_API_URL: BASE_URL + "/auth/delete-account",
  PASSWORD_RESET_OTP_API_URL: BASE_URL + "/auth/reset-password-otp",
  PASSWORD_RESET_API_URL: BASE_URL + "/auth/reset-password",
};

// POST ENDPOINTS
export const postEndpoints = {
  CREATE_POST_API_URL: BASE_URL + "/post/new",
  LIKE_UNLIKE_POST_API_URL: BASE_URL + "/post/like/:id",
  COMMENT_ON_POST_API_URL: BASE_URL + "/post/comment/:id",
  DELETE_COMMENT_API_URL: BASE_URL + "/post/comment/delete/:id",
  DELETE_POST_API_URL: BASE_URL + "/post/:id",
  UPDATE_POST_API_URL: BASE_URL + "/post/update/:id",
  GET_ALL_POSTS_API_URL: BASE_URL + "/post/all",
};

// USER ENDPOINTS
export const userEndpoints = {
  GET_FOLLOWINGS_API_URL: BASE_URL + "/user/followings",
  GET_USER_BY_ID: BASE_URL + "/user",
  FOLLOW_UNFOLLOW_USER_API_URL: BASE_URL + "/user/follow",
};
