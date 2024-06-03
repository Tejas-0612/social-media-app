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
