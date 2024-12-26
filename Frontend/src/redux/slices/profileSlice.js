import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  loading: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setUser(state, value) {
      state.user = value.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setNewPostToUser(state, value) {
      state.user.posts.unshift(value.payload);
    },
    updateFollowings(state, action) {
      // console.log("USER BEFORE ***", state.user);
      // console.log("Followings BEFORE ***", state.user.followings);
      state.user.followings = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
      // console.log("Followings AFTER ***", state.user.followings);
    },
  },
});

export const { setUser, setLoading, setNewPostToUser, updateFollowings } =
  profileSlice.actions;
export default profileSlice.reducer;
