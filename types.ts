
export enum AuthProvider {
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
  APPLE = 'apple'
}

export interface UserSession {
  id: string;
  email: string;
  name?: string;
}

export interface LoginFormData {
  email: string;
}
