import { getDBConnection } from '../db/datos';
import { IUser } from '../interfaces/user.interface';

export class UserModel {
  async findByUsername(username: string): Promise<IUser | undefined> {
    const db = await getDBConnection();
    const user = await db.get<IUser>('SELECT * FROM users WHERE username = ?', username);
    await db.close();
    return user;
  }

  async create(user: IUser): Promise<void> {
    const db = await getDBConnection();
    await db.run(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      user.username,
      user.password_hash,
      user.role || 'user'
    );
    await db.close();
  }

  async findById(id: number): Promise<IUser | undefined> {
    const db = await getDBConnection();
    const user = await db.get<IUser>('SELECT * FROM users WHERE id = ?', id);
    await db.close();
    return user;
  }
}