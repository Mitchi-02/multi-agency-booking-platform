import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, ObjectId } from "mongoose"

export type AgencyRequestDocument = HydratedDocument<AgencyRequest>

export enum AgencyRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REFUSED = "refused"
}

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: "agencies_requests",
  toObject: { versionKey: false },
  toJSON: { versionKey: false }
})
export class AgencyRequest {
  _id: ObjectId
  @Prop({ required: true, maxlength: 40, unique: true })
  email: string

  @Prop({ required: true, enum: AgencyRequestStatus, default: AgencyRequestStatus.PENDING })
  status: AgencyRequestStatus
}

export const AgencyRequestSchema = SchemaFactory.createForClass(AgencyRequest)
