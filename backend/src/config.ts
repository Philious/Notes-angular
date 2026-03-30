import { Config } from "./model";

export const config: Config = {
  origin: process.env['ORIGIN'] || "http://localhost:4200",
  port: Number(process.env['PORT']) || 3000,
  nodeEnv: process.env['ENV'] || 'development',
  secret: process.env['SECRET'] || 'my_secret'
};