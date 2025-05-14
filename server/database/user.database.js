// we will store users in a local file for simplicity as this is for a demo
import fs from 'fs/promises';
import path from 'path';

// User model:
// {
//   email: String,
//   password: String,
// }
// Users file structure:
// {
//   <username>: User,
//   <username>: User,
//   ...
// }

export default class UserDatabase {
  constructor() {
    this.path = path.join(process.cwd(), 'server/data/users.json');
    this.refresh = true;
    this.data = null;
  }

  async load() {
    if (!this.refresh && this.data) {
      return;
    }

    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.data = JSON.parse(data);
      this.refresh = false;
    } catch (error) {
      console.error(`Error reading file at ${this.path}:`, error);
      this.data = {};
    }
  }

  async save() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.data, null, 2));
      this.refresh = true;
    } catch (error) {
      console.error('Error writing users file:', error);
    }
  }

  async get(id) {
    await this.load();
    return this.data[id] || null;
  }

  async findBy(value, fieldName) {
    await this.load();
    return Object.values(this.data).find((user) => {
      return user[fieldName] === value;
    });
  }

  async create(item) {
    await this.load();
    const exists = await this.get(item.username);
    if (exists) {
      throw new Error('User already exists');
    }
    this.data[item.username] = item;
    await this.save();
    return item;
  }

  async delete(userName) {
    await this.load();
    const item = await this.get(userName);
    if (!item) {
      throw new Error('User not found');
    }
    delete this.data[userName];
    await this.save();
    return item;
  }

  async update(id, item) {
    await this.load();
    const exists = await this.get(id);
    if (!exists) {
      throw new Error('User not found');
    }
    this.data[id] = item;
    await this.save();
    return item;
  }
}
