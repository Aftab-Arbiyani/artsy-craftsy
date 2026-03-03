import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1762674944835 implements MigrationInterface {
  name = 'Migrations1762674944835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3c324ca49dabde7ffc0ef64675"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "UQ_3c324ca49dabde7ffc0ef64675d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "transaction_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "razorpay_transaction_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "upi_transaction_id" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "UQ_8fd5d8f4d3aac2c256265108dd9" UNIQUE ("upi_transaction_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "bank_transaction_id" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "UQ_1cc54a635c18de61143437336e1" UNIQUE ("bank_transaction_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "card_name" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "card_last4" character varying(4) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "network" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "issuer" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "emi" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "error_description" text`,
    );
    await queryRunner.query(`ALTER TABLE "payments" ADD "error_step" text`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "captured_at" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "failed_at" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "cancel_reason" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "orders" ADD "refunded_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "refund_amount" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_b2f7b823a21562eeca20e72b006"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."payments_payment_method_enum" RENAME TO "payments_payment_method_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('card', 'upi', 'netbanking')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum" USING "payment_method"::"text"::"public"."payments_payment_method_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."payments_payment_method_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."payments_status_enum" RENAME TO "payments_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum" AS ENUM('processing', 'success', 'failed', 'refund_processing', 'refunded', 'voided')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" TYPE "public"."payments_status_enum" USING "status"::"text"::"public"."payments_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'processing'`,
    );
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "REL_b2f7b823a21562eeca20e72b00"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."custom_art_status_enum" RENAME TO "custom_art_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."custom_art_status_enum" AS ENUM('requested', 'replied', 'accepted', 'ordered', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ALTER COLUMN "status" TYPE "public"."custom_art_status_enum" USING "status"::"text"::"public"."custom_art_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ALTER COLUMN "status" SET DEFAULT 'requested'`,
    );
    await queryRunner.query(`DROP TYPE "public"."custom_art_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_b2f7b823a21562eeca20e72b006"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."custom_art_status_enum_old" AS ENUM('requested', 'replied', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ALTER COLUMN "status" TYPE "public"."custom_art_status_enum_old" USING "status"::"text"::"public"."custom_art_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ALTER COLUMN "status" SET DEFAULT 'requested'`,
    );
    await queryRunner.query(`DROP TYPE "public"."custom_art_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."custom_art_status_enum_old" RENAME TO "custom_art_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "REL_b2f7b823a21562eeca20e72b00" UNIQUE ("order_id")`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum_old" AS ENUM('created', 'authorized', 'success', 'failed', 'refunded', 'voided')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" TYPE "public"."payments_status_enum_old" USING "status"::"text"::"public"."payments_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'created'`,
    );
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."payments_status_enum_old" RENAME TO "payments_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_payment_method_enum_old" AS ENUM('credit_card', 'debit_card', 'upi', 'bank_transfer')`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum_old" USING "payment_method"::"text"::"public"."payments_payment_method_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."payments_payment_method_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."payments_payment_method_enum_old" RENAME TO "payments_payment_method_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "refund_amount"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "refunded_at"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "cancel_reason"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "failed_at"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "captured_at"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "error_step"`);
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "error_description"`,
    );
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "emi"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "issuer"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "network"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "card_last4"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "card_name"`);
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "UQ_1cc54a635c18de61143437336e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "bank_transaction_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "UQ_8fd5d8f4d3aac2c256265108dd9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "upi_transaction_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "razorpay_transaction_id" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "transaction_id" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "UQ_3c324ca49dabde7ffc0ef64675d" UNIQUE ("transaction_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3c324ca49dabde7ffc0ef64675" ON "payments" ("transaction_id") `,
    );
  }
}
