
export interface IUser {
  id?: number;
  username: string;
  password_hash: string;
  role: 'user' | 'admin';
  created_at?: string;
  // Si no usas email, puedes quitarlo
  email?: string;
}


export {};