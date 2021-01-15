import { Post } from "../entities/Post";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";

import { getConnection } from "typeorm";
import { Upvote } from "../entities/Upvote";

import { User } from "../entities/User";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: Boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post): string {
    return post.text.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { upvoteLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }
    const vote = await upvoteLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });
    return vote ? vote.score : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const upvoteValue = value > 0 ? 1 : -1;
    const { userId } = req.session;
    const upvoteEntry = await Upvote.findOne({ where: { postId, userId } });

    if (upvoteEntry && upvoteEntry.score !== upvoteValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
        update upvote
        set score = $1
        where "postId" = $2  and "userId" = $3`,
          [upvoteValue, postId, userId]
        );

        await tm.query(
          `
            update post
            set points = points + $1
            where id = $2
          `,
          [2 * upvoteValue, postId]
        );
      });
    } else if (!upvoteEntry) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          insert into upvote ("userId", "postId", "score")
          values($1, $2, $3)
        `,
          [userId, postId, upvoteValue]
        );
        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
        `,
          [upvoteValue, postId]
        );
      });
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(30, limit);
    const prepared: any[] = [realLimit + 1];

    if (cursor) {
      prepared.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
     select p.*
      from post p 
      ${cursor ? `where p."createdAt" < $2` : ``}
      order by p."createdAt" DESC
      limit $1
    `,
      prepared
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimit + 1,
    };
  }

  @Query(() => Post, { nullable: true })
  singlePost(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    const post = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values({
        title: input.title,
        text: input.text,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();
    return post.raw[0];
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const res = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id= :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return res.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
