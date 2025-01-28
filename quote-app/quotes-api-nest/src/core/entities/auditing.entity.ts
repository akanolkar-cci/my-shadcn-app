import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PersistentEntity } from './persistent.entity';
import { Exclude } from 'class-transformer';

export abstract class AuditingEntity extends PersistentEntity {
  @CreateDateColumn({ name: 'created_at' })
  @Exclude()
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude()
  updated_at: Date;
}
