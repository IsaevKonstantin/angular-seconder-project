import { IUser } from "./user.model";

export type TContactStatus =  "PENDING" | "ACCEPTED" | "BLOCKED";

export interface IContact extends IUser {
  initiatorId: number;
  status: TContactStatus;
}
