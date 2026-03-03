import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1763818110555 implements MigrationInterface {
  name = 'Migrations1763818110555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "bank_rrn" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "vpa" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "bank" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "bank_transaction_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "UQ_1cc54a635c18de61143437336e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "created_timestamp" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "captured_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "failed_at" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "failed_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "captured_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "created_timestamp" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "UQ_1cc54a635c18de61143437336e1" UNIQUE ("bank_transaction_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "bank_transaction_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "bank" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "vpa" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "bank_rrn" SET NOT NULL`,
    );
  }
}
