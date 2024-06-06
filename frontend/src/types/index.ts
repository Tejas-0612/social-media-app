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
