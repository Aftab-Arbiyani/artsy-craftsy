import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserType1751025044724 implements MigrationInterface {
  name = 'UserType1751025044724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_type_enum" AS ENUM('artist', 'customer')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "type" "public"."user_type_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "bio" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."user_type_enum"`);
  }
}
