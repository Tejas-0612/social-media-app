export type IUser = {
  id: string;
  fullname: string;
  username: string;
  email: string;
  imageUrl: string;
  bio?: string;
};

export type profileUser = {
  _id: string;
  fullname: string;
  username: string;
  bio: string;
  avatar: { url: string };
  followers: Array<userDetails>;
  following: Array<userDetails>;
};

export type userDetails = {
  _id: string;
  avatar: { url: string };
  username: string;
};

export type INewUser = {
  fullname: string;
  email: string;
  username: string;
  password: string;
};

export type IUpdateUser = {
  fullname?: string;
  bio?: string;
};
export type IUpdateUserAvatar = {
  avatar: string;
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

// Post

export type IPost = {
  _id: string;
  authorId: { avatar: { url: string }; username: string; _id: string };
  type: string;
  content: string;
  imageUrl?: string;
  hashtags: Array<string>;
  mentions?: Array<string>;
  groupsId?: string;
  createdAt: string;
  likes: Array<string>;
  comments: Array<string>;
};

export type INewPost = {
  authorId: string;
  type?: string;
  content: string;
  image?: any;
  hashtags: Array<string>;
  mentions?: Array<string>;
  groupsId?: string;
};

export type IUpdatePost = {
  _id: string;
  content: string;
  hashtags: Array<string>;
  mentions: Array<string>;
};

export type PostFormProps = {
  post?: IPost;
  action: "create" | "update";
};

// Multiselect Component
export type SelectOption = {
  value: string;
  label: string;
  img?: string;
  subTitle?: string;
};

export type INotification = {
  _id?: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: string;
  user: { avatar: { url: string } };
};
