import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAddress1760682066449 implements MigrationInterface {
  name = 'AlterAddress1760682066449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD "country" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ALTER COLUMN "phone_number" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_address" ALTER COLUMN "phone_number" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user_address" DROP COLUMN "country"`);
  }
}
