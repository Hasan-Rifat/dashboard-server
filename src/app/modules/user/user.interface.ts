import { Model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../enums/user';

export const UserRole = ['admin', 'user'];

export type payload = {
  id: string;
  role: string;
  email: string;
};

export type IUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  password: string;
  verified: boolean;
  role: ENUM_USER_ROLE;
  dateOfBirth: string;
};

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<Pick<IUser, '_id' | 'password' | 'role' | 'email'>>;
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
