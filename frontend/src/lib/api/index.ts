import axios from "axios";

export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/api/current-user");
    return response.data;
  } catch (error) {
    console.log("Error fetching current user:", error);
    throw error;
  }
};
