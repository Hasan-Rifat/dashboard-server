"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
const create = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email(),
        phone: zod_1.z.string({ required_error: 'Phone is required' }),
        image: zod_1.z.string({ required_error: 'Image is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        role: zod_1.z.enum([...user_interface_1.UserRole]),
        dateOfBirth: zod_1.z.string({ required_error: 'Date of birth is required' }),
    }),
});
// update user optional
const update = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).optional(),
        email: zod_1.z.string({ required_error: 'Email is required' }).email().optional(),
        phone: zod_1.z.string({ required_error: 'Phone is required' }).optional(),
        image: zod_1.z.string({ required_error: 'Image is required' }).optional(),
        password: zod_1.z.string({ required_error: 'Password is required' }).optional(),
        role: zod_1.z.enum([...user_interface_1.UserRole]).optional(),
        dateOfBirth: zod_1.z
            .string({ required_error: 'Date of birth is required' })
            .optional(),
    }),
});
exports.UserValidation = {
    create,
    update,
};
