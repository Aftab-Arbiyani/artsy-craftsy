import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1763816012604 implements MigrationInterface {
  name = 'Migrations1763816012604';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "refund_response" json`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "razorpay_refund_id" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_refund_status_enum" AS ENUM('initiated', 'processed', 'failed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "refund_status" "public"."orders_refund_status_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "refund_status"`);
    await queryRunner.query(`DROP TYPE "public"."orders_refund_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "razorpay_refund_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "refund_response"`,
    );
  }
}
