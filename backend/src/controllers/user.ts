import { Request, Response, NextFunction } from 'express';
import { v4 as uid } from 'uuid';
import { users } from '../models/users';
import { User, UserRequest } from '../model';
import { errorFn } from '../utils';
import { createToken, verifyToken } from '../auth';

export const newUser = (
  req: Request<UserRequest>,
  res: Response<{ token: string }>,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const isNewEmail = users.every((u) => u.email.toLowerCase() !== email.toLowerCase());

    if (!password || !email || !isNewEmail) {
      if (!password) errorFn(res, 400, 'Details missing');
      if (!email) errorFn(res, 409, 'Email is empty');
      if (!isNewEmail) errorFn(res, 409, 'Email already exsists');

      return;
    }

    const newUser: User = {
      id: uid(),
      createdAt: new Date(),
      email,
      password,
    };

    users.push(newUser);
    const token = createToken(newUser.id);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const login = (req: Request, res: Response<{ token: string }>, next: NextFunction): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      errorFn(res, 401, 'Invalid credentials');

      return;
    }

    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      errorFn(res, 401, 'Invalid credentials');

      return;
    }

    if (user.password !== password) {
      errorFn(res, 401, 'Invalid credentials');

      return;
    }

    const token = createToken(user.id);
    res.cookie('notecookie', token, { maxAge: Date.now() + 86400000 });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request<{ userId: string }>, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId;

    if (userId) {
      res.status(200).json();
      res.clearCookie('notecookie');

      return;
    } else {
      errorFn(res, 500);
      return;
    }
  } catch (err) {
    next(err);
  }
};

export const checkStatus = (req: Request<{ token: string }>, res: Response) => {
  const userId = verifyToken(req.body.token)?.userId;

  res.status(200).json(!!users.find((u) => userId && u.id === userId));
};
