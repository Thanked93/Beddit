import DataLoader from "dataloader";
import { Vote } from "../entities/Vote";

export const createVoteLoader = () =>
  new DataLoader<
    { postId?: number; commentId?: number; userId: number },
    Vote | null
  >(async (keys) => {
    const votes = await Vote.find(keys as any);
    const idsToVotes: Record<string, Vote> = {};
    votes.forEach((v) => {
      idsToVotes[`${v.userId}|${v.postId ? v.postId : v.commentId}`] = v;
    });

    const c = keys.map(
      (key) =>
        idsToVotes[`${key.userId}|${key.postId ? key.postId : key.commentId}`]
    );
    return c;
  });
