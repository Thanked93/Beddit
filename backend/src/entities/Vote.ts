import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: "int" })
  score: number;

  @Field(() => Int)
  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @Field(() => Int)
  @Column({ nullable: true })
  postId?: number;

  @ManyToOne(() => Post, (post) => post.upvote, {
    onDelete: "CASCADE",
    nullable: true,
  })
  post?: Post;

  @Column({ nullable: true })
  commentId?: number;

  @ManyToOne(() => Comment, (comment) => comment.votes, {
    onDelete: "CASCADE",
    nullable: true,
  })
  comment?: Comment;
}
