import { inject, Injector } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take, tap, timeout } from "rxjs";

// auth.guard.ts
export const authGuard = async () => {
  const api = inject(ApiService);
  const router = inject(Router);

  return api.token() ? true : router.createUrlTree(['/login']);
}

