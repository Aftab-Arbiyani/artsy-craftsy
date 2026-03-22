import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1773934014676 implements MigrationInterface {
  name = 'Migrations1773934014676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "courier_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "shipped_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "courier_name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "tracking_number" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "courier_reciept" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "courier_reciept"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "tracking_number"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "courier_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "shipped_at"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "courier_name"`);
  }
}
