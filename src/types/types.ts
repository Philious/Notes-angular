export type Note = {
  id: string;
  title: string;
  content: string;
  catalog: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type NoteProps = {
  id?: string;
  title: string,
  content: string,
  catalog: string,
  tags: string[]
}

export type LoginDetails = {
  email: string;
  password: string;
}