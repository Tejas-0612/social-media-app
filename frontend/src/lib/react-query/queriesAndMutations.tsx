import { useMutation, useQuery } from "@tanstack/react-query";

import { INewUser } from "@/types";
import {
  createUserAccount,
  getAllUserGroups,
  getAllUsers,
  signInAccount,
  signOutAccount,
} from "../api";
import { QUERY_KEYS } from "./querykeys";

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

export const useGetAllUserGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_USER_GROUPS],
    queryFn: () => getAllUserGroups(),
  });
};
