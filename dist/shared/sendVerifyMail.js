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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendVerifyMail = (name, email, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config_1.default.nodemailer.user,
                pass: config_1.default.nodemailer.pass,
            },
        });
        const mailOptions = {
            from: config_1.default.nodemailer.user,
            to: email,
            subject: 'Verify your account',
            html: `<h1>Hi ${name}</h1><br><p>Click this link to verify your account: <a href="http://localhost:5000/api/v1/user/active-account/${token}">Verify</a></p>
      <p>your email ${email}</p>
      `,
        };
        const result = yield transporter.sendMail(mailOptions);
        console.log(result);
    }
    catch (error) { }
});
exports.default = sendVerifyMail;
