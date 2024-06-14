import { MigrationInterface, QueryRunner, Table } from "typeorm"

export default class CreateHikePaymentsTable1709927923346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "hike_payments",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "user_id",
            type: "bigint"
          },
          {
            name: "booking_id",
            type: "varchar",
            length: "24"
          },
          {
            name: "amount",
            type: "varchar",
            length: "20"
          },
          {
            name: "client_secret",
            type: "varchar",
            length: "255"
          },
          {
            name: "stripe_payment_id",
            type: "varchar",
            length: "255",
            isNullable: true
          },
          {
            name: "method",
            type: "enum",
            enum: ["cash", "card"]
          },
          {
            name: "paid",
            type: "boolean",
            default: false
          }
        ]
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("hike_payments")
  }
}
