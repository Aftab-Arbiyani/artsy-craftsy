import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cart1758345647795 implements MigrationInterface {
  name = 'Cart1758345647795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cart_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "cart_id" uuid, "product_id" uuid, CONSTRAINT "UQ_dba960dbfd8636893d3c7acb18d" UNIQUE ("cart_id", "product_id"), CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6385a745d9e12a89b859bb2562" ON "cart_items" ("cart_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_30e89257a105eab7648a35c7fc" ON "cart_items" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."carts_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TABLE "carts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "status" "public"."carts_status_enum" NOT NULL DEFAULT 'active', "user_id" uuid, CONSTRAINT "REL_2ec1c94a977b940d85a4f498ae" UNIQUE ("user_id"), CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2ec1c94a977b940d85a4f498ae" ON "carts" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts" ADD CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carts" DROP CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2ec1c94a977b940d85a4f498ae"`,
    );
    await queryRunner.query(`DROP TABLE "carts"`);
    await queryRunner.query(`DROP TYPE "public"."carts_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_30e89257a105eab7648a35c7fc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6385a745d9e12a89b859bb2562"`,
    );
    await queryRunner.query(`DROP TABLE "cart_items"`);
  }
}
