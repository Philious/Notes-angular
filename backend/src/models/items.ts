import { v4 as uid } from 'uuid';
import { Note, User } from '../model';

type MappedNotes<N extends Note = Note> = Map<Pick<User, 'id'>['id'], Map<Pick<N, 'id'>['id'], N>>;

const mapper = <T extends Note>(notes: T[]): Map<Pick<T, 'id'>['id'], T> => {
  const mappedNotes = new Map<Pick<T, 'id'>['id'], T>();
  notes.forEach((n: T) => {
    const id: Pick<T, 'id'>['id'] = n.id;
    mappedNotes.set(id, n);
  });

  return mappedNotes;
};

export const notes: MappedNotes = new Map([
  [
    '89503dc5-9517-48a2-833f-6bc7c0d32f1b',
    mapper([
      {
        id: uid(),
        title: 'Montera ner pariserhjulet',
        content:
          'Avsluta sista åkturen kl 22. Säkerställ att alla bultar är ordentligt förvarade, och märk sektionerna enligt instruktionerna.',
        catalog: 'Logistik',
        tags: ['pariserhjul', 'demontering', 'säkerhet'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uid(),
        title: 'Matvarulista för nästa stopp',
        content:
          'Behöver korv, bröd, senap, ketchup, socker till sockervaddsmaskinen och extra smör för popcornmaskinen.',
        catalog: 'Förnödenheter',
        tags: ['mat', 'förnödenheter', 'sockervadd'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uid(),
        title: 'Planera tivolins layout i Västerås',
        content:
          'Följ den nya planen för större säkerhetsavstånd. Placera radiobilarna nära ingången och skjutbanan längst bort.',
        catalog: 'Planering',
        tags: ['layout', 'säkerhet', 'platsplanering'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uid(),
        title: 'Reparation av berg-och-dalbanan',
        content:
          'Slitage på spåren märkt på sista sektionen. Kontrollera alla säkerhetsfästen, ta fram reservdelar om nödvändigt.',
        catalog: 'Underhåll',
        tags: ['berg-och-dalbana', 'reparation', 'säkerhet'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uid(),
        title: 'Kvällsshowen - förberedelser',
        content:
          'Dubbelkolla att musiken är klar och högtalarna fungerar. Kontrollera elden till eldslukaren och informera publik om säkerhetsavstånd.',
        catalog: 'Show',
        tags: ['show', 'förberedelser', 'eldslukare'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  ],
]);
