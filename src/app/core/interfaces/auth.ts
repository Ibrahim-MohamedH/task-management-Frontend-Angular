export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface IMe {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}
