import { z } from 'zod';

export const UserRoleSchema = z.enum(['user', 'admin']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserProfileSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain alphanumeric characters, dots, and hyphens'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  role: UserRoleSchema.default('user'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const AuthLoginPayloadSchema = z.object({
  identifier: z.string().min(1, 'Email, username or phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type AuthLoginPayload = z.infer<typeof AuthLoginPayloadSchema>;

export const AuthSignupPayloadSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain alphanumeric characters, dots, and hyphens'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});
export type AuthSignupPayload = z.infer<typeof AuthSignupPayloadSchema>;
