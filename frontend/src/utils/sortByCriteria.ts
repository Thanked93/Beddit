import {
  PostSnippetFragment,
  Comment,
  PostSnippetFragmentDoc,
} from "../generated/graphql";

export enum Orderby {
  UPVOTE,
  DOWNVOTE,
  CREATEDAT,
  UPDATEDAT,
}

const sortingVoteHighest = (o1, o2) => {
  if (o1 === null) return o1.points;
  if (o2 === null) return o2.points;
  return o2.points - o1.points;
};

export const sortByCriteria = (posts: PostSnippetFragment[], by: Orderby) => {
  const items = JSON.parse(JSON.stringify(posts));
  return items.sort(sortingVoteHighest);
};
