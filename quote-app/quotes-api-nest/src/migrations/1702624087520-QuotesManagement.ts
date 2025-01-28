import { MigrationInterface, QueryRunner } from 'typeorm';

export class QuotesManagement1702624087520 implements MigrationInterface {
  name = 'QuotesManagement1702624087520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quote" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "quote" character varying NOT NULL, "author" character varying NOT NULL, "likes" integer NOT NULL DEFAULT '0', "dislikes" integer NOT NULL DEFAULT '0', "tags" character varying, "userId" uuid, CONSTRAINT "PK_b772d4cb09e587c8c72a78d2439" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "anonymous_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "unique_address" character varying NOT NULL, "rate_limit" integer NOT NULL, CONSTRAINT "PK_700086efd7c61ba195fbf7dd97c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_quote_reaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "like" boolean NOT NULL DEFAULT false, "dislike" boolean NOT NULL DEFAULT false, "userId" uuid, "quoteId" uuid, CONSTRAINT "PK_0ea391e8cf30bf347cefebf349a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "quote" ADD CONSTRAINT "FK_bcbf020650ca118abc4cc1ceead" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quote_reaction" ADD CONSTRAINT "FK_8973468face903c9d336c06288a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quote_reaction" ADD CONSTRAINT "FK_1bfa997ea95d408c5f1f973a3c8" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_quote_reaction" DROP CONSTRAINT "FK_1bfa997ea95d408c5f1f973a3c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_quote_reaction" DROP CONSTRAINT "FK_8973468face903c9d336c06288a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quote" DROP CONSTRAINT "FK_bcbf020650ca118abc4cc1ceead"`,
    );
    await queryRunner.query(`DROP TABLE "user_quote_reaction"`);
    await queryRunner.query(`DROP TABLE "anonymous_user"`);
    await queryRunner.query(`DROP TABLE "quote"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
