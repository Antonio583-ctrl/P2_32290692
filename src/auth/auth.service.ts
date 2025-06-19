import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';

const userModel = new UserModel();

class AuthService {
  async login(username: string, password: string) {
    const user = await userModel.findByUsername(username);
    if (!user) throw new Error('Usuario no encontrado');
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Credenciales inválidas');
    return user;
  }

  async register(userData: IUser) {
    const existingUser = await userModel.findByUsername(userData.username);
    if (existingUser) throw new Error('El usuario ya existe');
    const password_hash = await bcrypt.hash(userData.password_hash, 10);
    await userModel.create({ ...userData, password_hash });
  }
}

export default new AuthService();