import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Quote } from 'src/quote/entities/quote.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class UserQuoteReaction extends AuditingEntity {
  @ManyToOne(() => User, { eager: true, cascade: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Quote, (quote) => quote.userQuoteReaction, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  quote: Quote;

  @Column({
    default: false,
  })
  like: boolean;

  @Column({
    default: false,
  })
  dislike: boolean;
}
