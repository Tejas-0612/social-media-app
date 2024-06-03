import { useMutation } from "@tanstack/react-query";

import { INewUser } from "@/types";
import { createUserAccount } from "../api";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};
