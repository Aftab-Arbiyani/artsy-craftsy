import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomArt1752989040125 implements MigrationInterface {
  name = 'CustomArt1752989040125';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `CREATE TABLE "custom_art" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP WITH TIME ZONE, "created_at_ip" character varying, "updated_at_ip" character varying, "deleted_at_ip" character varying, "full_name" character varying(50) NOT NULL, "email_address" character varying(50) NOT NULL, "request_id" character varying NOT NULL SET DEFAULT generate_request_id(), "description" text NOT NULL, "budget_range" character varying(50), "reference_image_url" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_acf3dff5e993b9d6dd6683b18c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bcc4fc0d8bf8623a9eab52b2e7" ON "custom_art" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_art" ADD CONSTRAINT "FK_bcc4fc0d8bf8623a9eab52b2e7c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "custom_art" DROP CONSTRAINT "FK_bcc4fc0d8bf8623a9eab52b2e7c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bcc4fc0d8bf8623a9eab52b2e7"`,
    );
    await queryRunner.query(`DROP TABLE "custom_art"`);
  }
}
