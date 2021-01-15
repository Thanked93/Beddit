import DataLoader from "dataloader";
import { Upvote } from "../entities/Upvote";

export const createUpvoteLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Upvote | null>(
    async (keys) => {
      const votes = await Upvote.findByIds(keys as any);
      const idsToVotes: Record<string, Upvote> = {};
      votes.forEach((v) => {
        idsToVotes[`${v.userId}|${v.postId}`] = v;
      });
      return keys.map((key) => idsToVotes[`${key.userId}|${key.postId}`]);
    }
  );
