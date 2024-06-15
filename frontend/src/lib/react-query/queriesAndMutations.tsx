import { useMutation, useQuery } from "@tanstack/react-query";

import {
  addComment,
  createGroup,
  createPost,
  createUserAccount,
  deletePost,
  exitGroup,
  getAllGroups,
  getAllLikedPostsByUserId,
  getAllPosts,
  getAllUserGroups,
  getAllUserPosts,
  getAllUsers,
  getGroupById,
  getGroupPosts,
  getPostById,
  getPostLikes,
  getUserById,
  getUserNotifications,
  joinGroup,
  signInAccount,
  signOutAccount,
  toggleFollowUser,
  togglePostLike,
  toggleSavePost,
  updateGroup,
  updatePost,
  updateUserAvatar,
  updateUserInfo,
  userSavedPosts,
} from "../api";
import { QUERY_KEYS } from "./querykeys";
import {
  INewGroup,
  INewPost,
  INewUser,
  IUpdateGroup,
  IUpdatePost,
  IUpdateUser,
} from "@/types";

// User Queries

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: {
      email?: String;
      password: String;
      username: String;
    }) => signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_USERS],
    queryFn: () => getAllUsers(),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useToggleFollowUser = () => {
  return useMutation({
    mutationFn: (followingId: string) => toggleFollowUser(followingId),
  });
};

export const useUpdateUserInfo = () => {
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUserInfo(user),
  });
};

export const useUpdateUserAvatar = () => {
  return useMutation({
    mutationFn: (avatar: string) => updateUserAvatar(avatar),
  });
};

// Group Queries

export const useGetAllGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_GROUPS],
    queryFn: () => getAllGroups(),
  });
};

export const useGetAllUserGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_USER_GROUPS],
    queryFn: () => getAllUserGroups(),
  });
};

// Post Queries

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
  });
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
  });
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
  });
};

export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetUserPosts = (authorId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_POST_BY_USER_ID, authorId],
    queryFn: () => getAllUserPosts(authorId),
    enabled: !!authorId,
  });
};

export const useGetAllPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_POSTS],
    queryFn: () => getAllPosts(),
  });
};

// Like Queries

export const useTogglePostLike = () => {
  return useMutation({
    mutationFn: (postId: string) => togglePostLike(postId),
  });
};

export const useGetAllLikedPostsByUserId = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_LIKES_BY_USER_ID, userId],
    queryFn: () => getAllLikedPostsByUserId(userId),
    enabled: !!userId,
  });
};

export const useGetPostLikes = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_LIKES, postId],
    queryFn: () => getPostLikes(postId),
    enabled: !!postId,
  });
};

export const useToggleSavePost = () => {
  return useMutation({
    mutationFn: (postId: string) => toggleSavePost(postId),
  });
};

export const useUserSavedPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_SAVED_POSTS],
    queryFn: () => userSavedPosts(),
  });
};

// Comment Queries

export const useAddComment = () => {
  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      addComment({ postId, content }),
  });
};

// Notification Queries

export const useGetUserNotifications = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_NOTIFICATIONS],
    queryFn: () => getUserNotifications(userId),
  });
};

// Group Queries

export const useCreateGroup = () => {
  return useMutation({
    mutationFn: (group: INewGroup) => createGroup(group),
  });
};

export const useUpdateGroup = () => {
  return useMutation({
    mutationFn: (group: IUpdateGroup) => updateGroup(group),
  });
};

export const useGetGroupById = (groupId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_GROUP_BY_ID, groupId],
    queryFn: () => getGroupById(groupId),
  });
};

export const useGetGroupPosts = (groupId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_GROUP_POSTS, groupId],
    queryFn: () => getGroupPosts(groupId),
  });
};

export const useJoinGroup = () => {
  return useMutation({
    mutationFn: (groupId: string) => joinGroup(groupId),
  });
};

export const useExitGroup = () => {
  return useMutation({
    mutationFn: (groupId: string) => exitGroup(groupId),
  });
};
