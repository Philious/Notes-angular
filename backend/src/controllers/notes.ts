import { Request, Response, NextFunction } from 'express';
import { v4 as uid } from 'uuid';
import { errorFn } from '../utils';
import { notes } from '../models/items';
import { Note } from '../model';

export const getAllNotes = (
  req: Request<never, { userId: string }>,
  res: Response<Note[]>,
  next: NextFunction,
) => {
  try {
    const userid = req.body.userId;
    const userNotes = notes.get(userid);

    if (!userNotes) {
      errorFn(res, 500);
      return;
    }

    res.status(200).json([...userNotes.values()]);
  } catch (err) {
    next(err);
  }
};

export const getNote = (
  req: Request<{ noteId: string }, { userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.body.userId;

    const note = notes.get(userId)?.get(noteId);

    if (note) {
      res.status(200).json(note);
    } else {
      errorFn(res, 404, 'Note not found');
    }
  } catch (err) {
    next(err);
  }
};

export const newNote = (
  req: Request<never, { userId: string; note: Partial<Note> }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, note } = req.body;

    if (userId) {
      const date = new Date();
      const newNote = {
        title: '',
        constent: '',
        ...note,
        id: uid(),
        createdAt: date,
        updatedAt: date,
      };

      notes.get(userId)?.set(note.id, newNote);
      res.status(200).json(newNote);
    } else {
      errorFn(res, 404, 'User not found');
    }
  } catch (err) {
    next(err);
  }
};

export const updateNote = (
  req: Request<never, { userId: string; note: Note }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, note } = req.body;

    const currentNote = notes.get(userId)?.get(note.id);

    if (currentNote) {
      const updatedNote: Note = { ...currentNote, ...note };
      notes.get(userId)?.set(note.id, updatedNote);

      res.status(200).json(updatedNote);
    } else {
      res.status(404).json({ error: "Note doesn't exist" });
    }
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (
  req: Request<{ noteId: string }, { userId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.body.userId;

    const userNotes = notes.get(userId);

    if (userNotes) {
      userNotes.delete(noteId);
      const filteredNotes = [...userNotes.values()];

      if (filteredNotes) {
        res.status(200).json();
      }
    } else {
      errorFn(res, 404, "Note doesn't exist");
      return;
    }
  } catch (err) {
    next(err);
  }
};
