export interface IUser {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  phone: string;
  email: string;
  about?: string | null;
  avatarBase64?: string | null;
}
