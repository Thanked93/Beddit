import { Vote } from "../../../entities/Vote";
import { getConnection } from "typeorm";
import { Req } from "../../../types";

export async function voteComment(id: number, req: Req, value: number) {
  const upvoteValue = value > 0 ? 1 : -1;
  const { userId } = req.session;
  const upvoteEntry = await Vote.findOne({
    where: { commentId: id, userId },
  });

  if (upvoteEntry && upvoteEntry.score !== upvoteValue) {
    await getConnection().transaction(async (tm) => {
      await tm.query(
        `
        update vote
        set score = $1
        where "commentId" = $2  and "userId" = $3`,
        [upvoteValue, id, userId]
      );

      await tm.query(
        `
            update comment
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
          insert into vote ("userId", "commentId", "score")
          values($1, $2, $3)
        `,
        [userId, id, upvoteValue]
      );
      await tm.query(
        `
          update comment
          set points = points + $1
          where id = $2
        `,
        [upvoteValue, id]
      );
    });
  }

  return true;
}
