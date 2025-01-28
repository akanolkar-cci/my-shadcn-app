import { MigrationInterface, QueryRunner } from 'typeorm';

export class QuoteCascade1703157207007 implements MigrationInterface {
  name = 'QuoteCascade1703157207007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_quote_reaction" DROP CONSTRAINT "FK_1bfa997ea95d408c5f1f973a3c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quote_reaction" ADD CONSTRAINT "FK_1bfa997ea95d408c5f1f973a3c8" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_quote_reaction" DROP CONSTRAINT "FK_1bfa997ea95d408c5f1f973a3c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quote_reaction" ADD CONSTRAINT "FK_1bfa997ea95d408c5f1f973a3c8" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
