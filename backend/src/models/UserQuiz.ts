import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("user_quizzes")
export class UserQuiz {
  @PrimaryColumn()
  user_id: string;

  @Column("jsonb", { nullable: true })

  @Column("int")
  score: number;

  @Column("text")
  analysis: string;

  @Column("jsonb")
  answers: string[];
}