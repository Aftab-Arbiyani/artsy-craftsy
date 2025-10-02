import { MigrationInterface, QueryRunner } from 'typeorm';

export class AiSuggestion1758954275594 implements MigrationInterface {
  name = 'AiSuggestion1758954275594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ai_suggestion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "prompt" text NOT NULL, "reference_image" character varying, "response_image" character varying, CONSTRAINT "PK_8c6eea3a4947e6a315113c396c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD "amount_receivable" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "ai_suggestions_count" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_suggestion_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ALTER COLUMN "price" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts" ALTER COLUMN "status" SET DEFAULT 'in_active'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carts" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ALTER COLUMN "price" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "last_suggestion_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "ai_suggestions_count"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" DROP COLUMN "amount_receivable"`,
    );
    await queryRunner.query(`DROP TABLE "ai_suggestion"`);
  }
}
