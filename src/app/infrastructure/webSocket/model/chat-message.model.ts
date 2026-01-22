export interface IChatMessage {
  fromUserId: number;
  toUserId: number;
  content: string;
  timestamp: number;
}
