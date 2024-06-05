import { useMutation } from "@tanstack/react-query";

import { INewUser } from "@/types";
import { createUserAccount, signInAccount, signOutAccount } from "../api";

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
