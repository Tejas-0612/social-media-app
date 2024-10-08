export enum QUERY_KEYS {
  // USER KEYS
  GET_USER_BY_ID = "getUserById",
  GET_ALL_USERS = "getAllUsers",
  GET_ALL_GROUPS = "getAllGroups",
  GET_ALL_USER_GROUPS = "getAllUserGroups",

  // POST KEYS
  GET_POST_BY_ID = "getPostById",
  GET_ALL_POST_BY_USER_ID = "getAllPostByUser",
  GET_ALL_POSTS = "getAllPosts",
  GET_POST_LIKES = "getPostLikes",
  GET_POST_LIKES_BY_USER_ID = "getPostLikesByUserId",

  //  Notification Keys
  GET_USER_NOTIFICATIONS = "getUserNotifications",

  // Saved keys
  GET_ALL_SAVED_POSTS = "getAllSavedPosts",

  // Group Keys
  GET_GROUP_BY_ID = "getGroupById",
  GET_GROUP_POSTS = "getGroupPosts",
}
