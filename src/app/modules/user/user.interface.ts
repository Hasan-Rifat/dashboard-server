import { Model } from 'mongoose';

export type IUser = {
  name: string;
  email: string;
  phone: string;
  image: string;
  dateOfBirth: string;
};

export type UserModel = Model<IUser>;
