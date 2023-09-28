import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.services';
import config from '../../../config';
import { Request, Response } from 'express';
import cloudinary from '../../../shared/cloudinary';
import sendVerifyMail from '../../../shared/sendVerifyMail';
import { payload } from './user.interface';

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await UserService.login(email, password);

  const { accessToken, refreshToken, user } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.cookie('accessToken', accessToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login success',
    token: accessToken,
    data: user,
  });
});

const logOut = catchAsync(async (req, res) => {
  res.cookie('refreshToken', '', { maxAge: 1 });
  res.cookie('accessToken', '', { maxAge: 1 });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'logOut success',
  });
});

const refreshAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await UserService.refreshAccessToken(refreshToken);

  const { accessToken } = result;

  const cookieOptions = {
    httpOnly: true,

    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'new token create successfully',
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all users success',
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const result = await UserService.getUserById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get user by id success',
    data: result,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(req.body.image);

    // Update req.body.image with the uploaded image URL
    req.body.image = uploadResult.secure_url;

    const { user, activationLink } = await UserService.createUser(req.body);
    await sendVerifyMail(user.name, user.email, activationLink);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Create user success please check your email to verify account',
      data: user,
    });
  } catch (error) {
    console.error(error);
    sendResponse(res, {
      statusCode: httpStatus.FORBIDDEN,
      message: (error as Error).message,
      success: false,
    });
  }
});

const activeAccount = catchAsync(async (req, res) => {
  const result = await UserService.activeAccount(req.params.token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'account Activated successfully',
  });
});

const updateUser = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error('Please upload a file');
  }

  const uploadResult = await cloudinary.uploader.upload(req.file.path);

  // Update req.body.image with the uploaded image URL
  req.body.image = uploadResult.secure_url;

  const result = await UserService.updateUser(req.params.id, req.body);
  if (!result) {
    throw new Error('User not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update user success',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await UserService.deleteUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete user success',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await UserService.getMe(req.user as payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get me success',
    data: result,
  });
});

export const UserController = {
  login,
  logOut,
  refreshAccessToken,
  activeAccount,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMe,
};
