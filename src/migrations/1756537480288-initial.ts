import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1756537480288 implements MigrationInterface {
  name = 'Initial1756537480288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE SEQUENCE IF NOT EXISTS public.product_number_seq
            INCREMENT 1
            START 1
            MINVALUE 1
            MAXVALUE 9223372036854775807
            CACHE 1;
    `);
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION public.generate_product_id () returns TEXT language 'plpgsql' cost 100 volatile parallel unsafe AS $BODY$
        DECLARE
            timestamp_part TEXT;
            random_part TEXT;
            new_product_number TEXT;
        BEGIN
            LOOP
                -- Generate product number
                timestamp_part := to_char(CURRENT_TIMESTAMP, 'MMYY');
                random_part := nextval('product_number_seq')::TEXT;
                -- Apply padding only if the sequence number is less than 1000
                IF CAST(random_part AS INTEGER) < 100000 THEN
                    random_part := LPAD(random_part, 6, '0');
                END IF;
                new_product_number := random_part;

                -- Check if the generated number already exists in the table
                EXIT WHEN NOT EXISTS (
                    SELECT 1 FROM product WHERE product_number::text = new_product_number::text
                );
            END LOOP;

            RETURN new_product_number;
        END;
        $BODY$;
    `);

    await queryRunner.query(`
        CREATE SEQUENCE IF NOT EXISTS public.request_number_seq
            INCREMENT 1
            START 1
            MINVALUE 1
            MAXVALUE 9223372036854775807
            CACHE 1;
    `);
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION public.generate_request_id () returns TEXT language 'plpgsql' cost 100 volatile parallel unsafe AS $BODY$
        DECLARE
            timestamp_part TEXT;
            random_part TEXT;
            new_request_number TEXT;
        BEGIN
            LOOP
                -- Generate product number
                timestamp_part := to_char(CURRENT_TIMESTAMP, 'MMYY');
                random_part := nextval('request_number_seq')::TEXT;
                -- Apply padding only if the sequence number is less than 1000
                IF CAST(random_part AS INTEGER) < 100000 THEN
                    random_part := LPAD(random_part, 6, '0');
                END IF;
                new_request_number := random_part;

                -- Check if the generated number already exists in the table
                EXIT WHEN NOT EXISTS (
                    SELECT 1 FROM custom_art WHERE request_id::text = new_request_number::text
                );
            END LOOP;

            RETURN new_request_number;
        END;
        $BODY$;
    `);
    await queryRunner.query(
      `CREATE TYPE "public"."user_address_type_enum" AS ENUM('home', 'work', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying(100) NOT NULL, "phone_number" character varying(15) NOT NULL, "street" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip_code" character varying NOT NULL, "type" "public"."user_address_type_enum" NOT NULL DEFAULT 'home', "user_id" uuid, CONSTRAINT "PK_302d96673413455481d5ff4022a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admins_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying, "status" "public"."admins_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."token_device_type_enum" AS ENUM('web', 'android', 'ios')`,
    );
    await queryRunner.query(
      `CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "jwt" text NOT NULL, "device_id" character varying, "device_name" character varying, "device_type" "public"."token_device_type_enum", "login_at" TIMESTAMP WITH TIME ZONE, "logout_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "admin_id" uuid, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."material_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TABLE "material" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying(100) NOT NULL, "status" "public"."material_status_enum" NOT NULL DEFAULT 'active', "category_id" uuid, CONSTRAINT "PK_0343d0d577f3effc2054cbaca7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f801cc3914e97d9ba4ba87c5d4" ON "material" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying NOT NULL, "description" text, "image" text, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "file_path" character varying NOT NULL, "product_id" uuid, CONSTRAINT "PK_09d4639de8082a32aa27f3ac9a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6bb4a69096db4f6a1f5bada15" ON "product_media" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."product_orientation_enum" AS ENUM('portrait', 'landscape', 'square', 'circular')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."product_status_enum" AS ENUM('active', 'in_active', 'sold', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "title" character varying(255) NOT NULL, "description" text NOT NULL, "orientation" "public"."product_orientation_enum" NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "height" double precision NOT NULL, "width" double precision NOT NULL, "depth" double precision, "weight" double precision, "tax" double precision NOT NULL, "listing_price" numeric(10,2) NOT NULL, "discount" numeric(5,2) NOT NULL DEFAULT '0', "amount_receivable" numeric(10,2) NOT NULL, "is_copyright_owner" boolean NOT NULL DEFAULT false, "product_number" character varying NOT NULL DEFAULT generate_product_id(), "year_of_artwork" character varying NOT NULL, "status" "public"."product_status_enum" NOT NULL DEFAULT 'active', "category_id" uuid, "user_id" uuid, "material_id" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_64069af8465e961d38023e721f" ON "product" ("product_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0dce9bc93c2d2c399982d04bef" ON "product" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3e59a34134d840e83c2010fac9" ON "product" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_413091a269be9f02f2b6e0bfa7" ON "product" ("material_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."custom_art_status_enum" AS ENUM('requested', 'replied', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "custom_art" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "dimensions" character varying(50) NOT NULL, "request_id" character varying NOT NULL DEFAULT generate_request_id(), "description" text NOT NULL, "budget_range" character varying(50), "reference_image" character varying NOT NULL, "reply" text, "status" "public"."custom_art_status_enum" NOT NULL DEFAULT 'requested', "price" numeric(10,2) NOT NULL, "user_id" uuid, "artist_id" uuid, CONSTRAINT "PK_acf3dff5e993b9d6dd6683b18c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bcc4fc0d8bf8623a9eab52b2e7" ON "custom_art" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_669dc785b18384b946ebab52e3" ON "custom_art" ("artist_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_type_enum" AS ENUM('artist', 'customer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying, "profile_picture" character varying, "date_of_birth" date, "is_email_verified" boolean NOT NULL DEFAULT false, "type" "public"."users_type_enum" NOT NULL, "bio" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
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
      `ALTER TABLE "user_address" ADD CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_e50ca89d635960fda2ffeb17639" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_5f202bdd180719e440aa50a9fd5" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "material" ADD CONSTRAINT "FK_f801cc3914e97d9ba4ba87c5d4d" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_media" ADD CONSTRAINT "FK_e6bb4a69096db4f6a1f5bada151" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_3e59a34134d840e83c2010fac9a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_413091a269be9f02f2b6e0bfa75" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD CONSTRAINT "FK_bcc4fc0d8bf8623a9eab52b2e7c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD CONSTRAINT "FK_669dc785b18384b946ebab52e39" FOREIGN KEY ("artist_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" ADD CONSTRAINT "FK_258d028d322ea3b856bf9f12f25" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS public.generate_request_id`,
    );
    await queryRunner.query(
      `DROP SEQUENCE IF EXISTS public.request_number_seq`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS public.generate_product_id`,
    );
    await queryRunner.query(
      `DROP SEQUENCE IF EXISTS public.product_number_seq`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp" DROP CONSTRAINT "FK_258d028d322ea3b856bf9f12f25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" DROP CONSTRAINT "FK_669dc785b18384b946ebab52e39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" DROP CONSTRAINT "FK_bcc4fc0d8bf8623a9eab52b2e7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_413091a269be9f02f2b6e0bfa75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_3e59a34134d840e83c2010fac9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_media" DROP CONSTRAINT "FK_e6bb4a69096db4f6a1f5bada151"`,
    );
    await queryRunner.query(
      `ALTER TABLE "material" DROP CONSTRAINT "FK_f801cc3914e97d9ba4ba87c5d4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_5f202bdd180719e440aa50a9fd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_e50ca89d635960fda2ffeb17639"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_address" DROP CONSTRAINT "FK_29d6df815a78e4c8291d3cf5e53"`,
    );
    await queryRunner.query(`DROP TABLE "otp"`);
    await queryRunner.query(`DROP TYPE "public"."otp_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."otp_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_669dc785b18384b946ebab52e3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bcc4fc0d8bf8623a9eab52b2e7"`,
    );
    await queryRunner.query(`DROP TABLE "custom_art"`);
    await queryRunner.query(`DROP TYPE "public"."custom_art_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_413091a269be9f02f2b6e0bfa7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3e59a34134d840e83c2010fac9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0dce9bc93c2d2c399982d04bef"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_64069af8465e961d38023e721f"`,
    );
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."product_orientation_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e6bb4a69096db4f6a1f5bada15"`,
    );
    await queryRunner.query(`DROP TABLE "product_media"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f801cc3914e97d9ba4ba87c5d4"`,
    );
    await queryRunner.query(`DROP TABLE "material"`);
    await queryRunner.query(`DROP TYPE "public"."material_status_enum"`);
    await queryRunner.query(`DROP TABLE "token"`);
    await queryRunner.query(`DROP TYPE "public"."token_device_type_enum"`);
    await queryRunner.query(`DROP TABLE "admins"`);
    await queryRunner.query(`DROP TYPE "public"."admins_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_address"`);
    await queryRunner.query(`DROP TYPE "public"."user_address_type_enum"`);
  }
}
