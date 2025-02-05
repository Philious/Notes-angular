import { IconEnum } from "./enum";

export type Note = {
  id: string;
  title: string;
  content: string;
  catalog: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type actionButton = {
  id: string;
  label: string;
  action: () => void;
  keepOpenOnClick?: boolean;
}

export type Option = actionButton & { icon?: IconEnum; }

export type Position = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  width: number,
  height: number
}