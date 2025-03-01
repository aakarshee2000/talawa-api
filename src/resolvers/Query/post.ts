import { QueryResolvers } from "../../types/generatedGraphQLTypes";
import { Post } from "../../models";
import { errors } from "../../libraries";
import {
  POST_NOT_FOUND,
  POST_NOT_FOUND_CODE,
  POST_NOT_FOUND_PARAM,
} from "../../constants";

export const post: QueryResolvers["post"] = async (_parent, args) => {
  const post = await Post.findOne({ _id: args.id })
    .populate("organization")
    .populate({
      path: "comments",
      populate: {
        path: "creator",
      },
    })
    .populate("likedBy")
    .populate("creator", "-password")
    .lean();

  if (!post) {
    throw new errors.NotFoundError(
      POST_NOT_FOUND,
      POST_NOT_FOUND_CODE,
      POST_NOT_FOUND_PARAM
    );
  }

  post.likeCount = post.likedBy.length || 0;
  post.commentCount = post.comments.length || 0;

  return post;
};
