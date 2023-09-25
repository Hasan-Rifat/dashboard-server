import { IUser } from './user.interface';
import { User } from './user.model';

const getAllUsers = async (): Promise<IUser[]> => {
  const users = await User.find();
  return users;
};

const getUserById = async (id: string): Promise<IUser | null> => {
  const users = await User.findById(id);
  return users;
};

const createUser = async (userData: IUser): Promise<IUser> => {
  const user = await User.create(userData);
  return user;
};

const updateUser = async (
  id: string,
  userData: IUser
): Promise<IUser | null> => {
  const user = await User.findByIdAndUpdate(id, userData);

  return user;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const user = await User.findByIdAndDelete(id);

  return user;
};

export const UserService = {
  login,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
