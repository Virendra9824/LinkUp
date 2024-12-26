import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
};

export const postSlice = createSlice({
  name: "post",
  initialState: initialState,
  reducers: {
    setPosts(state, value) {
      state.posts = value.payload;
    },

    setLoading(state, value) {
      state.loading = value.payload;
    },

    updateComment(state, action) {
      const { postId, updatedComment } = action.payload;
      state.posts = state.posts.map((post) =>
        post._id === postId
          ? { ...post, comments: [...post.comments, updatedComment] }
          : post
      );
    },

    deleteCommentFromPosts(state, action) {
      const { postId, commentId } = action.payload;
      state.posts = state.posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment._id !== commentId
              ),
            }
          : post
      );
    },

    likeUnlikePostRedux(state, action) {
      const { postId, likesCount, isLiked, likes } = action.payload;

      state.posts = state.posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likesCount, // Update likes count
              isLiked, // Update user's like status
              likes,
            }
          : post
      );
    },

    deletePostFromPosts(state, action) {
      const { postId } = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postId);
    },

    updateCaptionFromPosts(state, action) {
      const { postId, updatedCaption } = action.payload;
      state.posts = state.posts.map((post) =>
        post._id === postId ? { ...post, caption: updatedCaption } : post
      );
    },

    updateIsFriend(state, action) {
      const { userId, isFriend } = action.payload;
      state.posts = state.posts.map((post) =>
        post.owner?._id === userId ? { ...post, isFriend } : post
      );
    },

    updateFollowers(state, action) {
      const { userId, targetUserFollowers, isFriend } = action.payload;

      // Update the followers of the target user in posts
      state.posts = state.posts.map((post) =>
        post.owner?._id === userId
          ? {
              ...post,
              isFriend,
              owner: {
                ...post.owner,
                followers: targetUserFollowers,
              },
            }
          : post
      );
    },

    addNewPost(state, action) {
      const newPost = action.payload;
      state.posts.unshift(newPost);
    },
  },
});

export const {
  setPosts,
  setLoading,
  updateComment,
  deleteCommentFromPosts,
  likeUnlikePostRedux,
  deletePostFromPosts,
  updateCaptionFromPosts,
  updateIsFriend,
  addNewPost,
  updateFollowers,
} = postSlice.actions;
export default postSlice.reducer;
