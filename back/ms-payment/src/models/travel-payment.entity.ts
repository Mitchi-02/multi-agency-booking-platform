import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { PaymentMethod } from "."

@Entity("travel_payments")
export class TravelPayment {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column("bigint", { nullable: false })
  user_id: number

  @Column("varchar", { length: "24", nullable: false })
  booking_id: string

  @Column("varchar", { length: "20", nullable: true })
  amount: string

  @Column("varchar", { length: 255, nullable: true })
  client_secret: string | null

  @Column({
    type: "enum",
    enum: PaymentMethod,
    nullable: false
  })
  method: PaymentMethod

  @Column("varchar", { length: "255", nullable: true })
  stripe_payment_id: string | null

  @Column({ default: false })
  paid: boolean
}
