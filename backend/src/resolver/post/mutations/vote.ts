import { Upvote } from "../../../entities/Upvote";
import { getConnection } from "typeorm";
import { Req } from "../../../types";

export async function vote(id: number, value: number, req: Req) {
  const upvoteValue = value > 0 ? 1 : -1;
  const { userId } = req.session;
  const upvoteEntry = await Upvote.findOne({ where: { postId: id, userId } });

  if (upvoteEntry && upvoteEntry.score !== upvoteValue) {
    await getConnection().transaction(async (tm) => {
      await tm.query(
        `
        update upvote
        set score = $1
        where "postId" = $2  and "userId" = $3`,
        [upvoteValue, id, userId]
      );

      await tm.query(
        `
            update post
            set points = points + $1
            where id = $2
          `,
        [2 * upvoteValue, id]
      );
    });
  } else if (!upvoteEntry) {
    await getConnection().transaction(async (tm) => {
      await tm.query(
        `
          insert into upvote ("userId", "postId", "score")
          values($1, $2, $3)
        `,
        [userId, id, upvoteValue]
      );
      await tm.query(
        `
          update post
          set points = points + $1
          where id = $2
        `,
        [upvoteValue, id]
      );
    });
  }

  return true;
}
