import { MigrationInterface, QueryRunner } from 'typeorm';

export class Indexing1752729762030 implements MigrationInterface {
  name = 'Indexing1752729762030';

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
    await queryRunner.query(
      `ALTER TABLE "product" ADD "product_number" character varying NOT NULL SET DEFAULT generate_product_id()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f801cc3914e97d9ba4ba87c5d4" ON "material" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6bb4a69096db4f6a1f5bada15" ON "product_media" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_64069af8465e961d38023e721f" ON "product" ("product_number") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3e59a34134d840e83c2010fac9" ON "product" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_413091a269be9f02f2b6e0bfa7" ON "product" ("material_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_413091a269be9f02f2b6e0bfa7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3e59a34134d840e83c2010fac9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_64069af8465e961d38023e721f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e6bb4a69096db4f6a1f5bada15"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f801cc3914e97d9ba4ba87c5d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "product_number"`,
    );
  }
}
