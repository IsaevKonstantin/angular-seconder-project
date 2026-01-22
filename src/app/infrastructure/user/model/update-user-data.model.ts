export interface IUpdateUserDataRequest {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  phone: string;
  email: string;
  about?: string | null;
  avatarBase64?: string | null;
  currentPassword?: string | null;
  newPassword?: string | null;
}
