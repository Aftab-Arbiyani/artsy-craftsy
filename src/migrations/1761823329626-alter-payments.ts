import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPayments1761823329626 implements MigrationInterface {
  name = 'AlterPayments1761823329626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "international" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "razorpay_transaction_id" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "razorpay_fees" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "razorpay_tax" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "bank_rrn" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "vpa" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "card_id" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "bank" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "razorpay_response" json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "created_timestamp" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "UQ_3c324ca49dabde7ffc0ef64675d" UNIQUE ("transaction_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "razorpay_payment_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "UQ_e7d1bec5311dcddd28c50547e82" UNIQUE ("razorpay_payment_id")`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."payments_status_enum" RENAME TO "payments_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum" AS ENUM('created', 'authorized', 'success', 'failed', 'refunded', 'voided')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" TYPE "public"."payments_status_enum" USING "status"::"text"::"public"."payments_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'created'`,
    );
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum_old"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_3c324ca49dabde7ffc0ef64675" ON "payments" ("transaction_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e7d1bec5311dcddd28c50547e8" ON "payments" ("razorpay_payment_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e7d1bec5311dcddd28c50547e8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3c324ca49dabde7ffc0ef64675"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum_old" AS ENUM('pending', 'completed', 'failed', 'refunded')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" TYPE "public"."payments_status_enum_old" USING "status"::"text"::"public"."payments_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."payments_status_enum_old" RENAME TO "payments_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "UQ_e7d1bec5311dcddd28c50547e82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "razorpay_payment_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "UQ_3c324ca49dabde7ffc0ef64675d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "created_timestamp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "razorpay_response"`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "bank"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "card_id"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "vpa"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "bank_rrn"`);
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "razorpay_tax"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "razorpay_fees"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "razorpay_transaction_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "international"`,
    );
  }
}
