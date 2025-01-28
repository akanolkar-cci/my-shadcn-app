import { Exclude } from 'class-transformer';
import { AuditingEntity } from 'src/core/entities/auditing.entity';
import { Entity, Column, DeleteDateColumn } from 'typeorm';

@Entity()
export class User extends AuditingEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
