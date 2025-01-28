import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class AnonymousUser extends AuditingEntity {
  @Column({ name: 'unique_address' })
  uniqueAddress: string;

  @Column({ name: 'rate_limit' })
  rateLimit: number;
}
