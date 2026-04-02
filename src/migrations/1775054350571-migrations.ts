import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1775054350571 implements MigrationInterface {
  name = 'Migrations1775054350571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_plans_billing_cycle_enum" AS ENUM('monthly', 'yearly')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscription_plans_status_enum" AS ENUM('active', 'in_active')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscription_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "name" character varying NOT NULL, "description" character varying, "amount" numeric NOT NULL DEFAULT '0', "billing_cycle" "public"."subscription_plans_billing_cycle_enum" NOT NULL, "razorpay_plan_id" character varying NOT NULL, "generation_limit" integer NOT NULL, "status" "public"."subscription_plans_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_424ab7439a5b2a5de28d623936" ON "subscription_plans" ("razorpay_plan_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('pending', 'paid', 'active', 'cancelled', 'expired', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "razorpay_subscription_id" character varying(100) NOT NULL, "razorpay_payment_id" character varying(100), "razorpay_invoice_id" character varying(100), "email" character varying(100), "phone_number" character varying(15), "amount" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."subscriptions_status_enum" NOT NULL DEFAULT 'pending', "payment_method" character varying, "cancelled_at" bigint, "start_date" bigint, "end_date" bigint, "error_description" text, "error_step" text, "razorpay_response" json, "user_id" uuid, "plan_id" uuid, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d0a95ef8a28188364c546eb65c" ON "subscriptions" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_df212973727f317bad0f8bad54" ON "subscriptions" ("razorpay_subscription_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fcceaccda7a27aa3d46670c97b" ON "subscriptions" ("razorpay_payment_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fcb82dd1248a96003a7339bd98" ON "subscriptions" ("razorpay_invoice_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e45fca5d912c3a2fab512ac25d" ON "subscriptions" ("plan_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_e45fca5d912c3a2fab512ac25dc" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_e45fca5d912c3a2fab512ac25dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_d0a95ef8a28188364c546eb65c1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e45fca5d912c3a2fab512ac25d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fcb82dd1248a96003a7339bd98"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fcceaccda7a27aa3d46670c97b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df212973727f317bad0f8bad54"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d0a95ef8a28188364c546eb65c"`,
    );
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_424ab7439a5b2a5de28d623936"`,
    );
    await queryRunner.query(`DROP TABLE "subscription_plans"`);
    await queryRunner.query(
      `DROP TYPE "public"."subscription_plans_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."subscription_plans_billing_cycle_enum"`,
    );
  }
}
