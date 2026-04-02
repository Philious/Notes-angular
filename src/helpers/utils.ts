import { Note } from './types';

export const sortNotes = (notes: Note[]): Note[] => {
  return notes.sort((a, b) => {
    const date = new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
    if (date !== 0) return date;
    return a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1;
  });
};

export const setCookie = (name: string, value: string, hours: number): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const getCookie = (name: string): string | null => {
  const cookieString: string = document.cookie || '';
  const cookies: Record<string, string> = cookieString.split('; ').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return cookies[name] ?? null;
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const formatDate = (
  () => (date: Date) =>
    Intl.DateTimeFormat('sv-se', { year: '2-digit', month: '2-digit', day: '2-digit' }).format(date)
)();
