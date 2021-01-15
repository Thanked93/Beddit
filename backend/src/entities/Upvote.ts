import { Entity, Column, PrimaryColumn, BaseEntity, ManyToOne } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class Upvote extends BaseEntity {
  @Column({ type: "int" })
  score: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.upvote)
  user: User;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.upvote, {
    onDelete: "CASCADE",
  })
  post: Post;
}
