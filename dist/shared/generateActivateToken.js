"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const config_1 = __importDefault(require("../config"));
const generateActivateToken = (user) => {
    const activationLink = jwtHelpers_1.jwtHelpers.createToken({ user }, config_1.default.jwt.active_link_secret, config_1.default.jwt.active_link_expires_in);
    return { activationLink };
};
exports.default = generateActivateToken;
