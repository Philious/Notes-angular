export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserRequest = {
  email: string;
  password: string;
};

export type Config = {
  origin: string;
  port: number;
  nodeEnv: string;
  secret: string;
};
