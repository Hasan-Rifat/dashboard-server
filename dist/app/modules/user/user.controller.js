"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_services_1 = require("./user.services");
const config_1 = __importDefault(require("../../../config"));
const cloudinary_1 = __importDefault(require("../../../shared/cloudinary"));
const sendVerifyMail_1 = __importDefault(require("../../../shared/sendVerifyMail"));
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield user_services_1.UserService.login(email, password);
    const { accessToken, refreshToken } = result;
    const cookieOptions = {
        secure: config_1.default.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('accessToken', accessToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Login success',
        token: accessToken,
    });
}));
const logOut = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('refreshToken', '', { maxAge: 1 });
    res.cookie('accessToken', '', { maxAge: 1 });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'logOut success',
    });
}));
const refreshAccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield user_services_1.UserService.refreshAccessToken(refreshToken);
    const { accessToken } = result;
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'new token create successfully',
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserService.getAllUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get all users success',
        data: result,
    });
}));
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserService.getUserById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get user by id success',
        data: result,
    });
}));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadResult = yield cloudinary_1.default.uploader.upload(req.body.image);
        // Update req.body.image with the uploaded image URL
        req.body.image = uploadResult.secure_url;
        const { user, activationLink } = yield user_services_1.UserService.createUser(req.body);
        yield (0, sendVerifyMail_1.default)(user.name, user.email, activationLink);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'Create user success please check your email to verify account',
            data: user,
        });
    }
    catch (error) {
        console.error(error);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.FORBIDDEN,
            message: error.message,
            success: false,
        });
    }
}));
const activeAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserService.activeAccount(req.params.token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'account Activated successfully',
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new Error('Please upload a file');
    }
    const uploadResult = yield cloudinary_1.default.uploader.upload(req.file.path);
    // Update req.body.image with the uploaded image URL
    req.body.image = uploadResult.secure_url;
    const result = yield user_services_1.UserService.updateUser(req.params.id, req.body);
    if (!result) {
        throw new Error('User not found');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Update user success',
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserService.deleteUser(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Delete user success',
        data: result,
    });
}));
exports.UserController = {
    login,
    logOut,
    refreshAccessToken,
    activeAccount,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
