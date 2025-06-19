import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../../models/user.model';

const userModel = new UserModel();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Busca usuario por Google ID o email
      let user = await userModel.findByUsername(profile.emails?.[0].value || '');
      if (!user) {
        // Si no existe, crea uno nuevo
        await userModel.create({
          username: profile.emails?.[0].value || '',
          password_hash: '', // No hay contraseña local
          role: 'user',
        });
        user = await userModel.findByUsername(profile.emails?.[0].value || '');
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));