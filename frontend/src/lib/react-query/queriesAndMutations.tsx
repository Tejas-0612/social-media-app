import { useMutation, useQuery } from "@tanstack/react-query";

import {
  addComment,
  createPost,
  createUserAccount,
  getAllGroups,
  getAllLikedPostsByUserId,
  getAllPosts,
  getAllUserGroups,
  getAllUsers,
  getPostById,
  getPostLikes,
  signInAccount,
  signOutAccount,
  togglePostLike,
  updatePost,
} from "../api";
import { QUERY_KEYS } from "./querykeys";
import { INewPost, INewUser, IUpdatePost } from "@/types";

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

export const useGetPostById = (postId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
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
    mutationFn: ({ postId }: { postId: string }) => togglePostLike(postId),
  });
};

export const useGetAllLikedPostsByUserId = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_LIKES_BY_USER_ID, postId],
    queryFn: () => getAllLikedPostsByUserId(postId),
    enabled: !!postId,
  });
};

export const useGetPostLikes = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_LIKES, postId],
    queryFn: () => getPostLikes(postId),
    enabled: !!postId,
  });
};

// Comment Queries

export const useAddComment = () => {
  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      addComment({ postId, content }),
  });
};
