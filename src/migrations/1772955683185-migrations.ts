import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1772955683185 implements MigrationInterface {
  name = 'Migrations1772955683185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" ADD "shipped_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "courier_reciept" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "courier_reciept"`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shipped_at"`);
  }
}
