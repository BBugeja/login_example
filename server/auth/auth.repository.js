// we will store users in a local file for simplicity as this is for a demo
import UserDB from '../database/user.database.js';

export default class AuthRepository {
  constructor() {
    this.userDb = new UserDB();
  }

  async findUserByUsername(username) {
    return await this.userDb.get(username);
  }

  async findUserByEmail(email) {
    return await this.userDb.findBy(email, 'email');
  }

  async createUser(userData) {
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    const existingUsername = await this.findUserByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already in use');
    }

    try {
      return await this.userDb.create(userData);
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  async updateUser(userName, updateData) {
    const user = await this.userDb.get(userName);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateData);
    await this.userDb.update(userName, user);
    return user;
  }
}
