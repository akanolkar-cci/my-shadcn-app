import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserSoftDelete1702883294175 implements MigrationInterface {
  name = 'UserSoftDelete1702883294175';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
  }
}
