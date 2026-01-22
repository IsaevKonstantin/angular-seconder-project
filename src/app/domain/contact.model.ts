import { IContact } from "./friendship.model";

export interface IContactWS extends IContact {
  online: boolean;
  unread: number;
}