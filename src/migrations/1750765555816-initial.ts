import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1750765555816 implements MigrationInterface {
  name = 'Initial1750765555816';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_address_type_enum" AS ENUM('home', 'work', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying(100) NOT NULL, "phone_number" character varying(15) NOT NULL, "street" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_code" character varying NOT NULL, "type" "public"."user_address_type_enum" NOT NULL DEFAULT 'home', "user_id" uuid, CONSTRAINT "PK_302d96673413455481d5ff4022a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying, "is_email_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying NOT NULL, "description" text, "image" text, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying(255) NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "image_url" character varying, "artist" character varying(100) NOT NULL, "stock" integer NOT NULL, "category_id" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."token_device_type_enum" AS ENUM('web', 'android', 'ios')`,
    );
    await queryRunner.query(
      `CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "jwt" text NOT NULL, "device_id" character varying, "device_name" character varying, "device_type" "public"."token_device_type_enum", "login_at" TIMESTAMP WITH TIME ZONE, "logout_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_e50ca89d635960fda2ffeb17639" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_e50ca89d635960fda2ffeb17639"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53"`,
    );
    await queryRunner.query(`DROP TABLE "token"`);
    await queryRunner.query(`DROP TYPE "public"."token_device_type_enum"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_address"`);
    await queryRunner.query(`DROP TYPE "public"."user_address_type_enum"`);
  }
}
