import { Link, useParams } from "react-router-dom";

import { IComment } from "@/types";
import Loader from "@/components/shared/Loader";
import CommentCard from "@/components/shared/CommentCard";
import CommentDetailsCard from "@/components/shared/CommentDetailsCard";

import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetPostById,
  useGetUserPosts,
} from "@/lib/react-query/queriesAndMutations";
import GridPostList from "@/components/shared/GridPostList";
import GridTextPostList from "@/components/shared/GridTextPostList";

const PostDetails = () => {
  const { postId } = useParams();
  const { user } = useUserContext();

  const { data: post, isPending } = useGetPostById(postId);
  const { data: userPosts, isPending: isUserPosts } = useGetUserPosts(
    post?.data.authorId._id
  );

  if (!post?.data) return <Loader />;

  const { _id, imageUrl, authorId, content, hashtags, comments, createdAt } =
    post.data;

  if (isPending || isUserPosts) return <Loader />;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="post-details-container">
          <div className={`${!imageUrl && "hidden"} post-details-img`}>
            <img src={imageUrl} className="w-full md:w-[430px] md:h-[400px]" />
          </div>
          <div className="post-details-info px-4">
            <div className="flex flex-between pt-3">
              <div className="flex gap-3">
                <img
                  src={
                    authorId.avatar.url ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-12 lg:h-12 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {authorId.username}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/edit/${_id}`}
                  className={`${user.id !== authorId._id && "hidden"}`}
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={20}
                    height={20}
                  />
                </Link>
                <Link
                  to={`/edit/${_id}`}
                  className={`${user.id !== authorId._id && "hidden"}`}
                >
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={20}
                    height={20}
                  />
                </Link>
              </div>
            </div>
            <div className="small-medium lg:base-medium pt-5">
              <p>{content}</p>
              <ul className="flex gap-1 mt-2">
                {hashtags.map((tag: string, index: number) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
              <div className="border-b-2 border-light-4 opacity-40 mt-4" />
            </div>
            <div>
              <p className="small-regular text-light-2 pt-2">comments</p>
              <ul className="h-[160px] overflow-scroll custom-scrollbar">
                {comments.length == 0 ? (
                  <p className="body-regular text-center pt-14">
                    No comments to show{" "}
                  </p>
                ) : (
                  comments.map((comment: IComment) => (
                    <li key={comment._id}>
                      <CommentDetailsCard
                        user={comment.userId}
                        comment={comment.content}
                        time={comment.createdAt}
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="w-full">
              <CommentCard post={post?.data} userImg={user.imageUrl} />
            </div>
          </div>
        </div>

        {isUserPosts ? (
          <Loader />
        ) : (
          userPosts.data.length > 0 && (
            <div className="w-full">
              <h1 className="h4-bold lg:h3-bold my-2">More Related Posts</h1>
              <div className="flex flex-col gap-4">
                <GridPostList
                  posts={userPosts.data}
                  showUser={false}
                  showStats={false}
                />
                <GridTextPostList
                  posts={userPosts.data}
                  showUser={false}
                  showStats={false}
                />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PostDetails;
