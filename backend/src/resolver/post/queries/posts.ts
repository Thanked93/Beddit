import { getConnection } from "typeorm";
import { PaginatedPost } from "../types/PaginatedPost";

export async function posts(
  limit: number,
  cursor: string | null
): Promise<PaginatedPost> {
  // Set a maximal limit to prevent pulling whole database
  const maxLimit = Math.min(limit, 30);
  const preparedForStatement: any[] = [maxLimit + 1];
  if (cursor) {
    preparedForStatement.push(new Date(parseInt(cursor)));
  }

  const postPaginated = await getConnection().query(
    `
        Select p.* from post p
        ${cursor ? `where p."createdAt" < $2` : ""}
        order by p."createdAt" DESC
        limit $1
    `,
    preparedForStatement
  );

  return {
    posts: postPaginated.slice(0, maxLimit),
    hasMore: postPaginated.length === maxLimit + 1,
  };
}
