import { IconEnum } from './enum';

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type NoteProps = {
  id?: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Note = Expand<
  NoteProps & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }
>;

export type ActionButton = {
  id: string;
  label: string;
  action: () => void;
};

export type Option = {
  id: string;
  label: string;
  action: () => void;
  icon?: IconEnum;
};

export type Position = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};
