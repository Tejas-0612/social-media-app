import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addComment,
  createGroup,
  createPost,
  createUserAccount,
  deleteGroup,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (followingId: string) => toggleFollowUser(followingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
    },
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GROUP_POSTS],
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?._id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GROUP_POSTS],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GROUP_POSTS],
      });
    },
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => togglePostLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_LIKES],
      });
    },
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => toggleSavePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_SAVED_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_POST_BY_USER_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
      });
    },
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      addComment({ postId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_POSTS],
      });
    },
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (group: IUpdateGroup) => updateGroup(group),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GROUP_BY_ID],
      });
    },
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => joinGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GROUP_BY_ID],
      });
    },
  });
};

export const useExitGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => exitGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_GROUP_BY_ID],
      });
    },
  });
};

export const useDeleteGroup = () => {
  return useMutation({
    mutationFn: (groupId: string) => deleteGroup(groupId),
  });
};
