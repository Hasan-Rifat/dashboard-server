import { string, z } from 'zod';
import { UserRole } from './user.interface';

const create = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    phone: z.string({ required_error: 'Phone is required' }),
    password: z.string({ required_error: 'Password is required' }),
    role: z.enum([...UserRole] as [string, ...string[]]),
    dateOfBirth: z.string({ required_error: 'Date of birth is required' }),
  }),
});

// update user optional
const update = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    email: z.string({ required_error: 'Email is required' }).email().optional(),
    phone: z.string({ required_error: 'Phone is required' }).optional(),
    password: z.string({ required_error: 'Password is required' }).optional(),
    role: z.enum([...UserRole] as [string, ...string[]]).optional(),
    dateOfBirth: z
      .string({ required_error: 'Date of birth is required' })
      .optional(),
  }),
});

export const UserValidation = {
  create,
  update,
};
