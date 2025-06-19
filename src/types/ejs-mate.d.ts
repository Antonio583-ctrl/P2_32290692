declare module 'ejs-mate' {
  import { Request, Response } from 'express';
  import { Options } from 'ejs';
  import { PathLike } from 'fs';

  function ejsMate(path: PathLike, options: Options, callback: (err: Error | null, str?: string) => void): void;
  export default ejsMate;
}