import { MigrationInterface, QueryRunner } from "typeorm";

export class Product1751121007567 implements MigrationInterface {
    name = 'Product1751121007567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."admin_status_enum" AS ENUM('active', 'in_active')`);
        await queryRunner.query(`CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying, "status" "public"."admin_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."material_status_enum" AS ENUM('active', 'in_active')`);
        await queryRunner.query(`CREATE TABLE "material" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying(100) NOT NULL, "status" "public"."material_status_enum" NOT NULL DEFAULT 'active', "category_id" uuid, CONSTRAINT "PK_0343d0d577f3effc2054cbaca7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "image_url"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "artist"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "stock"`);
        await queryRunner.query(`ALTER TABLE "token" ADD "admin_id" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD "title" character varying(255) NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."product_orientation_enum" AS ENUM('portrait', 'landscape', 'square', 'circular')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "orientation" "public"."product_orientation_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "quantity" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "height" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "width" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "depth" double precision`);
        await queryRunner.query(`ALTER TABLE "product" ADD "weight" double precision`);
        await queryRunner.query(`ALTER TABLE "product" ADD "tax" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "listing_price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "discount" numeric(5,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "amount_receivable" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "is_copyright_owner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product" ADD "material_id" uuid`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_5f202bdd180719e440aa50a9fd5" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "material" ADD CONSTRAINT "FK_f801cc3914e97d9ba4ba87c5d4d" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_413091a269be9f02f2b6e0bfa75" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_413091a269be9f02f2b6e0bfa75"`);
        await queryRunner.query(`ALTER TABLE "material" DROP CONSTRAINT "FK_f801cc3914e97d9ba4ba87c5d4d"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_5f202bdd180719e440aa50a9fd5"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "material_id"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "is_copyright_owner"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "amount_receivable"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "discount"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "listing_price"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "tax"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "depth"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "width"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "orientation"`);
        await queryRunner.query(`DROP TYPE "public"."product_orientation_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "admin_id"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "stock" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "artist" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "image_url" character varying`);
        await queryRunner.query(`ALTER TABLE "product" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE "material"`);
        await queryRunner.query(`DROP TYPE "public"."material_status_enum"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TYPE "public"."admin_status_enum"`);
    }

}
