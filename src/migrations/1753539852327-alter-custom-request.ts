import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCustomRequest1753539852327 implements MigrationInterface {
  name = 'AlterCustomRequest1753539852327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "custom_art" DROP COLUMN "full_name"`);
    await queryRunner.query(
      `ALTER TABLE "custom_art" DROP COLUMN "email_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" DROP COLUMN "reference_image_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD "dimensions" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD "reference_image" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "custom_art" ADD "reply" text`);
    await queryRunner.query(
      `CREATE TYPE "public"."custom_art_status_enum" AS ENUM('requested', 'replied', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD "status" "public"."custom_art_status_enum" NOT NULL DEFAULT 'requested'`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD "price" numeric(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "custom_art" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "custom_art" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."custom_art_status_enum"`);
    await queryRunner.query(`ALTER TABLE "custom_art" DROP COLUMN "reply"`);
    await queryRunner.query(
      `ALTER TABLE "custom_art" DROP COLUMN "reference_image"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" DROP COLUMN "dimensions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD "reference_image_url" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD "email_address" character varying(50) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD "full_name" character varying(50) NOT NULL`,
    );
  }
}
