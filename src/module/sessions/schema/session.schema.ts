import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


@Schema({ id: false, versionKey: false })
export class Session {
  @Prop({ required: true, type: String })
  ip: string;
  @Prop({ required: true, type: String })
  userId: string;
  @Prop({ required: true, type: String })
  deviceId: string;
  @Prop({ required: false, type: String })
  lastActiveDate: string;
  @Prop({ required: true, type: String })
  title: string;
}

export type SessionDocument = HydratedDocument<Session>
export const SessionSchema = SchemaFactory.createForClass(Session)
