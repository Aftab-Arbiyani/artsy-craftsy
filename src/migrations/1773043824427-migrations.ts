import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1773043824427 implements MigrationInterface {
  name = 'Migrations1773043824427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ai_suggestion" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "ai_suggestion" ADD CONSTRAINT "FK_d03a9ef28a0dcb6af88e9d7f103" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ai_suggestion" DROP CONSTRAINT "FK_d03a9ef28a0dcb6af88e9d7f103"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ai_suggestion" DROP COLUMN "user_id"`,
    );
  }
}
