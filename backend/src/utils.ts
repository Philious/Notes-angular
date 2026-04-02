import { Response } from 'express';

export const errorFn = (res: Response, errorStatus: number, errorMessage?: string) => {
  res.status(errorStatus).send(errorMessage);
  throw new Error(errorMessage);
};
