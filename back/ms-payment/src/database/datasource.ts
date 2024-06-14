import { DataSource } from "typeorm"
import CreateTravelPaymentsTable1709927923346 from "./migrations/1709927923346-create_travel_payments_table"
import CreateHikePaymentsTable1709927923346 from "./migrations/1715622641318-create_hike_payments_table"

export const AppDataSource = new DataSource({
  type: (process.env.DB_CONNECTION as any) || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 5433,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "aaa",
  database: process.env.DB_DATABASE || "tripx",
  logging: true,
  entities: ["../models/*.ts"],
  migrations: [CreateTravelPaymentsTable1709927923346, CreateHikePaymentsTable1709927923346],
  synchronize: true,
  migrationsRun: false
})
