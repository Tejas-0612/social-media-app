import axios from "axios";

import {
  INewGroup,
  INewPost,
  INewUser,
  IUpdateGroup,
  IUpdatePost,
  IUpdateUser,
} from "@/types";

export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/api/v1/users/current-user");
    return response.data;
  } catch (error) {
    console.log("Error fetching current user:", error);
    throw error;
  }
};

export const createUserAccount = async (user: INewUser) => {
  try {
    const response = await axios.post("/api/v1/users/register", user);
    return response.data;
  } catch (error) {
    console.log("Error creating new user account: ", error);
    throw error;
  }
};

export const signInAccount = async (user: {
  email?: String;
  password: String;
  username: String;
}) => {
  try {
    const response = await axios.post("/api/v1/users/login", user);
    return response.data;
  } catch (error) {
    console.log("Error while logging into user account: ", error);
    throw error;
  }
};

export const signOutAccount = async () => {
  try {
    const response = await axios.post("/api/v1/users/logout");
    return response.data;
  } catch (error) {
    console.log("Error while signing out the user account: ", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get("/api/v1/users/all-users");
    return response.data;
  } catch (error) {
    console.log("Error while getting all users: ", error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`/api/v1/users/profile/${userId}`);
    return response.data.data;
  } catch (error) {
    console.log("error while getting a user", error);
    throw error;
  }
};

export const toggleFollowUser = async (followingId: string) => {
  if (!followingId) throw Error;
  try {
    const response = await axios.patch(`/api/v1/users/follow/${followingId}`);
    return response.data;
  } catch (error) {
    console.log("error while following user", error);
    throw error;
  }
};

export const updateUserInfo = async (user: IUpdateUser) => {
  try {
    const response = await axios.patch(`/api/v1/users/update-profile`, user);
    return response.data;
  } catch (error) {
    console.log("error while getting user details", error);
    throw error;
  }
};

export const updateUserAvatar = async (avatar: any) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await axios.patch(
      "/api/v1/users/update-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error while updating a user's avatar", error);
    throw error;
  }
};

export const getAllGroups = async () => {
  try {
    const response = await axios.get("/api/v1/group/");
    return response.data;
  } catch (error) {
    console.log("Error while getting all groups: ", error);
    throw error;
  }
};

export const getAllUserGroups = async () => {
  try {
    const response = await axios.get("/api/v1/group/user/groups");
    return response.data;
  } catch (error) {
    console.log("Error while getting all user groups: ", error);
    throw error;
  }
};

export const createPost = async (post: INewPost) => {
  try {
    console.log(post);
    const formData = new FormData();
    formData.append("authorId", post.authorId);
    formData.append("content", post.content);
    post.hashtags.forEach((hashtag) => formData.append("hashtags", hashtag));
    post?.mentions?.forEach((mention) => formData.append("mentions", mention));
    if (post.image) {
      formData.append("image", post.image);
    }

    console.log(formData);
    const response = await axios.post("/api/v1/post/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log("error while creating a new Post:", error);
    throw error;
  }
};

export const updatePost = async (post: IUpdatePost) => {
  try {
    const response = await axios.patch(`/api/v1/post/update/${post._id}`, post);
    return response.data;
  } catch (error) {
    console.log("error while updating a post:", error);
    throw error;
  }
};

export const getPostById = async (postId?: string) => {
  if (!postId) throw Error;
  try {
    const response = await axios.get(`/api/v1/post/${postId}`);
    return response.data;
  } catch (error) {
    console.log("error while getting a post by Id:", postId);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get("/api/v1/post");
    return response.data;
  } catch (error) {
    console.log("error while getting all posts", error);
    throw error;
  }
};

export const getAllUserPosts = async (authorId: string) => {
  if (!authorId) throw Error;
  try {
    const response = await axios.get(`/api/v1/post/user/${authorId}`);
    return response.data;
  } catch (error) {
    console.log("error while getting user posts", error);
    throw error;
  }
};

export const togglePostLike = async (postId: string) => {
  try {
    const response = await axios.patch(`/api/v1/like/post/${postId}`);
    return response.data;
  } catch (error) {
    console.log("Error getting while liking a post", error);
    throw error;
  }
};

export const getAllLikedPostsByUserId = async (userId: string) => {
  if (!userId) throw Error;
  try {
    const response = await axios.post(`/api/v1/like/user/${userId}`);
    return response.data;
  } catch (error) {
    console.log("Error getting while liking a post", error);
    throw error;
  }
};

export const getPostLikes = async (postId: string) => {
  try {
    const response = await axios.get(`/api/v1/like/${postId}`);
    return response.data;
  } catch (error) {
    console.log("error while getting post likes", error);
    throw error;
  }
};

export const addComment = async ({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) => {
  console.log(postId, content);
  try {
    const response = await axios.post(`/api/v1/comment/add/${postId}`, {
      content,
    });
    return response.data;
  } catch (error) {
    console.log("error while adding a comment", error);
    throw error;
  }
};

export const toggleSavePost = async (postId: string) => {
  try {
    const response = await axios.patch(`/api/v1/save/${postId}`);
    return response.data;
  } catch (error) {
    console.log("Error getting while liking a post", error);
    throw error;
  }
};

export const userSavedPosts = async () => {
  try {
    const response = await axios.get("/api/v1/save/");
    return response.data;
  } catch (error) {
    console.log("error while getting saved posts", error);
    throw error;
  }
};

// Notifications

export const getUserNotifications = async (userId: string) => {
  try {
    console.log(userId);
    const response = await axios.get(`/api/v1/notification/user/${userId}`);
    return response.data;
  } catch (error) {
    console.log("error while getting user notifications", error);
    throw error;
  }
};

// Group

export const createGroup = async (group: INewGroup) => {
  try {
    const formData = new FormData();
    formData.append("name", group.name);
    formData.append("description", group.description);

    if (group.avatar) formData.append("avatar", group.avatar);

    if (group.coverImage) formData.append("coverImage", group.coverImage);

    const response = await axios.post("/api/v1/group/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.log("error while creating a group", error);
    throw error;
  }
};

export const updateGroup = async (group: IUpdateGroup) => {
  try {
    const formData = new FormData();

    if (group.name) formData.append("name", group.name);
    if (group.description) formData.append("description", group.description);
    if (group.avatar) formData.append("avatar", group.avatar);
    if (group.coverImage) formData.append("coverImage", group.coverImage);

    const response = await axios.patch(
      `/api/v1/group/update/${group._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("error while updating a group", error);
    throw error;
  }
};

export const getGroupById = async (groupId: string) => {
  try {
    const response = await axios.get(`/api/v1/group/${groupId}`);
    return response.data;
  } catch (error) {
    console.log("error while getting a group info:", error);
    throw error;
  }
};

export const getGroupPosts = async (groupId: string) => {
  try {
    const response = await axios.get(`/api/v1/group/posts/${groupId}`);
    return response.data;
  } catch (error) {
    console.log("error while getting group posts", error);
    throw error;
  }
};

export const joinGroup = async (groupId: string) => {
  try {
    const response = await axios.patch(`/api/v1/group/join/${groupId}`);
    return response.data;
  } catch (error) {
    console.log("error while joining a group", error);
    throw error;
  }
};

export const exitGroup = async (groupId: string) => {
  try {
    const response = await axios.patch(`/api/v1/group/exit/${groupId}`);
    return response.data;
  } catch (error) {
    console.log("error while exiting a group", error);
    throw error;
  }
};
