import { Note } from "./types";

export const sortNotes = (notes: Note[]): Note[] => {
  return notes.sort((a, b) => {
    const date = new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
    if (date !== 0) return date;
    return a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1
  });
}