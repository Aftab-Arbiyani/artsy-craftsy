import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1778057553339 implements MigrationInterface {
  name = 'Migrations1778057553339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."token_device_type_enum" RENAME TO "token_device_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."token_device_type_enum" AS ENUM('web', 'android', 'ios', 'mobile', 'tablet')`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "device_type" TYPE "public"."token_device_type_enum" USING "device_type"::"text"::"public"."token_device_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."token_device_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."token_device_type_enum_old" AS ENUM('web', 'android', 'ios', 'mobile')`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ALTER COLUMN "device_type" TYPE "public"."token_device_type_enum_old" USING "device_type"::"text"::"public"."token_device_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."token_device_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."token_device_type_enum_old" RENAME TO "token_device_type_enum"`,
    );
  }
}
