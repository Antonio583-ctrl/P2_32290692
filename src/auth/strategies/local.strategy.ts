import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel } from '../../models/user.model';
import bcrypt from 'bcryptjs';

const userModel = new UserModel();

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await userModel.findByUsername(username);
      if (!user) return done(null, false, { message: 'Usuario no encontrado' });
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await userModel.findById(id);
    if (!user) return done(new Error('Usuario no encontrado'));
    done(null, user);
  } catch (error) {
    done(error);
  }
});
