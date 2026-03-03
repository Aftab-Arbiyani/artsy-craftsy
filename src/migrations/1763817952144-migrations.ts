import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1763817952144 implements MigrationInterface {
  name = 'Migrations1763817952144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "card_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "card_name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "card_last4" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "network" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "issuer" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "issuer" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "network" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "card_last4" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "card_name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ALTER COLUMN "card_id" SET NOT NULL`,
    );
  }
}
