import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1774267721515 implements MigrationInterface {
  name = 'Migrations1774267721515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_bank_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "razorpay_contact_id" character varying NOT NULL, "razorpay_fund_account_id" character varying NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "user_id" uuid, CONSTRAINT "PK_94aaf3f58cfa2b25efc21ed115a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_bank_accounts" ADD CONSTRAINT "FK_9e19e984d14d4f857c1ed2dab63" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_bank_accounts" DROP CONSTRAINT "FK_9e19e984d14d4f857c1ed2dab63"`,
    );
    await queryRunner.query(`DROP TABLE "user_bank_accounts"`);
  }
}
