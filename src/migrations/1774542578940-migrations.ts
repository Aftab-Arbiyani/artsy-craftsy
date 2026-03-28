import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1774542578940 implements MigrationInterface {
  name = 'Migrations1774542578940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "refunded_at"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "refunded_at" bigint`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "refunded_at"`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "refunded_at" TIMESTAMP`);
  }
}
