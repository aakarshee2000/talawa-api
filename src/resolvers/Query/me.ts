import { QueryResolvers } from "../../types/generatedGraphQLTypes";
import { User } from "../../models";
import { errors } from "../../libraries";
import {
  USER_NOT_FOUND,
  USER_NOT_FOUND_CODE,
  USER_NOT_FOUND_PARAM,
} from "../../constants";

// Resolver function for field 'me' of type 'Query'
export const me: QueryResolvers["me"] = async (_parent, _args, context) => {
  const currentUser = await User.findOne({
    _id: context.userId,
  })
    .select(["-password"])
    .populate("createdOrganizations")
    .populate("createdEvents")
    .populate("joinedOrganizations")
    .populate("registeredEvents")
    .populate("eventAdmin")
    .populate("adminFor")
    .lean();

  if (!currentUser) {
    throw new errors.NotFoundError(
      USER_NOT_FOUND,
      USER_NOT_FOUND_CODE,
      USER_NOT_FOUND_PARAM
    );
  }

  return currentUser;
};
