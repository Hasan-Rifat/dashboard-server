import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IUser, payload } from './user.interface';
import { User } from './user.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import generateActivateToken from '../../../shared/generateActivateToken';

const getAllUsers = async (): Promise<IUser[]> => {
  const users = await User.find();
  return users;
};

const getUserById = async (id: string): Promise<IUser | null> => {
  const users = await User.findById(id);
  return users;
};

const login = async (
  email: string,
  password: string
): Promise<{
  user: Partial<IUser> | null;
  accessToken: string;
  refreshToken: string;
}> => {
  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPasswordMatch = await User.isPasswordMatch(
    password,
    isUserExist.password
  );

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'credential not match');
  }

  // create access token
  const accessToken = jwtHelpers.createToken(
    { id: isUserExist._id, role: isUserExist.role, email: isUserExist.email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // create refresh token
  const refreshToken = jwtHelpers.createToken(
    { id: isUserExist._id, role: isUserExist.role, email: isUserExist.email },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  const user = await User.findOne({ email }).select(
    '-password -createdAt -updatedAt'
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};
const refreshAccessToken = async (
  token: string
): Promise<{
  accessToken: string;
}> => {
  const user = jwtHelpers.verifyToken(
    token,
    config.jwt.refresh_secret as Secret
  );

  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
  }

  const accessToken = jwtHelpers.createToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

const createUser = async (
  userData: IUser
): Promise<{
  user: IUser;
  activationLink: string;
}> => {
  const user = await User.create(userData);

  const { activationLink } = generateActivateToken(user);

  return { user, activationLink };
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

const activeAccount = async (activationLink: string) => {
  const user = jwtHelpers.verifyToken(
    activationLink,
    config.jwt.active_link_secret as Secret
  );

  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
  }

  const updatedUser = await User.findByIdAndUpdate(
    user.user._id,
    {
      verified: true,
    },
    { new: true }
  );

  return { updatedUser, message: 'Active account success' };
};

const getMe = async (user: payload): Promise<IUser | null> => {
  const me = await User.findById(user.id).select(
    '-password -createdAt -updatedAt'
  );

  return me;
};

export const UserService = {
  login,
  refreshAccessToken,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  activeAccount,
  deleteUser,
  getMe,
};
