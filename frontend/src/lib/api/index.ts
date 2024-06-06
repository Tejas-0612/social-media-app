import axios from "axios";

import { INewUser } from "@/types";

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

export const getAllUserGroups = async () => {
  try {
    const response = await axios.get("/api/v1/group/user/groups");
    return response.data;
  } catch (error) {
    console.log("Error while getting all user groups: ", error);
    throw error;
  }
};
