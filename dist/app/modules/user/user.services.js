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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("./user.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const generateActivateToken_1 = __importDefault(require("../../../shared/generateActivateToken"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    return users;
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.findById(id);
    return users;
});
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.isUserExist(email);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isPasswordMatch = yield user_model_1.User.isPasswordMatch(password, isUserExist.password);
    if (!isPasswordMatch) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'credential not match');
    }
    // create access token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ id: isUserExist._id, role: isUserExist.role, email: isUserExist.email }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // create refresh token
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ id: isUserExist._id, role: isUserExist.role, email: isUserExist.email }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    const user = yield user_model_1.User.findOne({ email }).select('-password -createdAt -updatedAt');
    return {
        user,
        accessToken,
        refreshToken,
    };
});
const refreshAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid token');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ id: user.id, email: user.email, role: user.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // create refresh token
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ id: user._id, role: user.role, email: user.email }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.create(userData);
    const { activationLink } = (0, generateActivateToken_1.default)(user);
    return { user, activationLink };
});
const updateUser = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(id, userData);
    return user;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndDelete(id);
    return user;
});
const activeAccount = (activationLink) => __awaiter(void 0, void 0, void 0, function* () {
    const user = jwtHelpers_1.jwtHelpers.verifyToken(activationLink, config_1.default.jwt.active_link_secret);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid token');
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(user.user._id, {
        verified: true,
    }, { new: true });
    return { updatedUser, message: 'Active account success' };
});
const getMe = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const me = yield user_model_1.User.findById(user.id).select('-password -createdAt -updatedAt');
    return me;
});
exports.UserService = {
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
