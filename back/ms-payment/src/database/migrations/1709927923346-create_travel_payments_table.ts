import { MigrationInterface, QueryRunner, Table } from "typeorm"

export default class CreateTravelPaymentsTable1709927923346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "travel_payments",
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
            type: "bigint",
            isNullable: false
          },
          {
            name: "booking_id",
            type: "varchar",
            length: "24",
            isNullable: false
          },
          {
            name: "amount",
            type: "varchar",
            length: "20",
            isNullable: false
          },
          {
            name: "client_secret",
            type: "varchar",
            length: "255",
            isNullable: true
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
            enum: ["cash", "card"],
            isNullable: false
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
    await queryRunner.dropTable("travel_payments")
  }
}
