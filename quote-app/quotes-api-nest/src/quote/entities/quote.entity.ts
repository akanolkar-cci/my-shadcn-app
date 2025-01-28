import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserQuoteReaction } from './user-quote-reaction.entity';

@Entity()
export class Quote extends AuditingEntity {
  @Column()
  quote: string;

  @Column()
  author: string;

  @Column({
    default: 0,
  })
  likes: number;

  @Column({
    default: 0,
  })
  dislikes: number;

  @Column({
    nullable: true,
  })
  tags: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @OneToMany(
    () => UserQuoteReaction,
    (userQuoteReaction) => userQuoteReaction.quote,
  )
  userQuoteReaction: UserQuoteReaction[];
}
