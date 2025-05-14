import AuthRepository from './auth.repository.js';
import argon2 from 'argon2';
import crypto from 'crypto';

export default class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(userData) {
    try {
      const user = await this.authRepository.findUserByUsername(
        userData.username
      );

      if (!user) {
        throw new Error('Invalid username or password');
      }

      const pepper = process.env.PASSWORD_PEPPER || 'defaultPepper';
      const isValidPassword = await argon2.verify(
        user.password,
        `${userData.password}${pepper}${user.salt}`
      );

      if (!isValidPassword) {
        throw new Error('Invalid username or password');
      }
      return user;
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Login failed');
    }
  }

  async register(userData) {
    const pepper = process.env.PASSWORD_PEPPER || 'defaultPepper';
    const salt = crypto.randomBytes(16).toString('hex');

    userData.password = `${userData.password}${pepper}${salt}`;
    const hashedPassword = await argon2.hash(userData.password, {
      type: argon2.argon2id,
      timeCost: 2,
      memoryCost: 2 ** 16,
    });
    userData.password = hashedPassword;
    userData.salt = salt;
    try {
      return await this.authRepository.createUser(userData);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
