import { MigrationInterface, QueryRunner } from 'typeorm';

export class Otp1750926834355 implements MigrationInterface {
  name = 'Otp1750926834355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."otp_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."otp_type_enum" AS ENUM('signup', 'login', 'forgot_password', 'change_number')`,
    );
    await queryRunner.query(
      `CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "status" "public"."otp_status_enum" NOT NULL DEFAULT 'active', "otp" integer NOT NULL, "email" character varying, "country_code" character varying(5), "contact_number" character varying(15), "type" "public"."otp_type_enum" NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "expire_at" integer NOT NULL, "user_id" uuid, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" ADD CONSTRAINT "FK_258d028d322ea3b856bf9f12f25" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otp" DROP CONSTRAINT "FK_258d028d322ea3b856bf9f12f25"`,
    );
    await queryRunner.query(`DROP TABLE "otp"`);
    await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."otp_status_enum"`);
  }
}
