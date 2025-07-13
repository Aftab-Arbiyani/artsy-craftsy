import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserProfile1751642803425 implements MigrationInterface {
  name = 'UserProfile1751642803425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "profile_picture" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "date_of_birth" date`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_picture"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "date_of_birth"`);
  }
}
