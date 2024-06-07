export type IUser = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  imageUrl: string;
  bio?: string;
};

export type INewUser = {
  fullname: string;
  email: string;
  username: string;
  password: string;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUsers = {
  _id: string;
  fullname: string;
  username: string;
  avatar: { url: string };
  followers: Array<string>;
};

export type IGroups = {
  _id: string;
  name: string;
  username: string;
  avatar: { url: string };
  members: Array<string>;
  admin: { _id: string };
};

export type IProfileCardProps = {
  username?: string;
  _id: string;
  avatar: { url: string };
  fullname: string;
  followers?: Array<string>;
  currentUserId: string;
  type: "user" | "group";
  admin?: { _id: string };
};
