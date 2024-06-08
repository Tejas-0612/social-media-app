import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createPost,
  createUserAccount,
  getAllGroups,
  getAllUserGroups,
  getAllUsers,
  getPostById,
  signInAccount,
  signOutAccount,
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
