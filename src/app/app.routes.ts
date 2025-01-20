import { Routes } from '@angular/router';
import { NotesPage } from './pages/login.page';
import { LoginPage } from './pages/notes.page';
import { CheckTokenPage } from './pages/checkToken.page';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'notes', component: NotesPage },
  { path: '**', component: CheckTokenPage },
];
