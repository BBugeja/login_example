// controller for authentication
import AuthService from './auth.service.js';

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await this.authService.login({ username, password });
      req.session.username = user.username;
      res.status(200).redirect('/auth-wall.html');
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const user = await this.authService.register({
        username,
        email,
        password,
      });
      req.session.username = user.username;
      res.status(201).redirect('/auth-wall.html');
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async logout(req, res) {
    try {
      await req.session.destroy();
      res.status(200).redirect('/');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
