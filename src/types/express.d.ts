// src/types/express.d.ts
import { TFunction } from 'i18next';

declare namespace Express {
  export interface Request {
    t: TFunction;
    language: string;
  }
}