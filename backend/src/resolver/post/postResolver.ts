import { MyContext } from "../../types";
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Post } from "../../entities/Post";
import { User } from "../../entities/User";
import { isAuth } from "../../middleware/isAuth";
import { createPost } from "./mutations/createPost";
import { updatePost } from "./mutations/updatePost";
import { vote } from "./mutations/vote";
import { posts } from "./queries/posts";
import { PaginatedPost } from "./types/PaginatedPost";
import { PostInput } from "./types/PostInput";
import { PostResponse } from "./types/PostResponse";

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
  async voteStatus(@Root() post: Post, @Ctx() { voteLoader, req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    const vote = await voteLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });
    return vote ? vote.score : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("id", () => Int) id: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    return await vote(id, value, req);
  }

  @Query(() => PaginatedPost)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPost> {
    return await posts(limit, cursor);
  }

  @Query(() => Post, { nullable: true })
  singlePost(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<PostResponse> {
    return await createPost(input, req);
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: MyContext
  ): Promise<PostResponse> {
    return await updatePost(id, title, text, req);
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
