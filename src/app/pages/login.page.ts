import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { InputLayoutComponent } from '../components/action/input-layout.component';
import { IconEnum, InputState } from '../../helpers/enum';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { ApiService } from '../../services/api.service';

export enum PageState {
  Login = 'login',
  NewUser = 'new',
  Forgot = 'forgot',
}

@Component({
  selector: 'login',
  imports: [InputLayoutComponent, IconButtonComponent, ReactiveFormsModule],
  template: `
    <div class="login-view">
      <div class="title">{{ title }}</div>
      <form class="form" [class]="pageState" [formGroup]="profileForm" (ngSubmit)="login()">
        <input-layout
          class="email"
          [helpText]="emailFieldHelpText"
          [inputId]="'email'"
          [label]="'Email'"
          [state]="emailFieldState"
        >
          <input
            autocomplete="on"
            base-input
            formControlName="email"
            id="email"
            input
            type="text"
          />
        </input-layout>
        @if (pageState !== PageState.Forgot) {
          <input-layout
            class="password"
            [helpText]="passwordFieldHelpText"
            [inputId]="'password'"
            [label]="'Password'"
            [state]="passwordFieldState"
          >
            <input base-input formControlName="password" id="password" input type="text" />
          </input-layout>
        }
        <icn-btn class="login-btn fill" type="submit" [icon]="IconEnum.Right" />
      </form>
      <div class="buttons">
        @if (pageState !== PageState.Login) {
          <button
            animate.enter="enter"
            animate.leave="leave"
            btn
            class="vertical back"
            text-btn
            (click)="updateState(PageState.Login)"
          >
            Back
          </button>
        }
        @if (pageState === PageState.Login) {
          <button
            animate.enter="enter"
            animate.leave="leave"
            btn
            class="vertical new"
            text-btn
            (click)="updateState(PageState.NewUser)"
          >
            New User
          </button>
        }
        @if (pageState === PageState.Login) {
          <button
            animate.enter="enter"
            animate.leave="leave"
            btn
            class="vertical forgot"
            text-btn
            (click)="updateState(PageState.Forgot)"
          >
            Forgot password
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    .login-view {
      border: none;
      background-color: transparent;
      box-sizing: border-box;
      display: grid;
      gap: 1.5rem 0;
      place-content: center;
      width: 100vw;
      height: 100vh;
      padding: 2rem;
      max-width: 20rem;
      margin: auto;
      grid-template-rows: 1fr auto 3.5rem 3.5rem 1fr 4.5rem;
      grid-template-columns: 1fr 3.5rem;
      place-items: center start;

      .title {
        grid-area: 2 / 1 / 3 / 2;
      }
      .email {
        grid-area: 3 / 1 / 4 / 2;
      }
      .password {
        grid-area: 4 / 1 / 5 / 2;
        transition:
          opacity 0.25s,
          transform 0.25s;
      }
      .login-btn {
        grid-area: 4 / 3 / 5 / 2;
        transition: transform 0.25s;
      }
      .buttons {
        grid-area: 6 / 1 / 7 / 3;
        justify-content: start;
        display: grid;
        width: 9.25rem;
        height: 5rem;
        position: relative;
        transform-origin: left bottom;
        transform: translateY(2rem) rotate(-90deg) translateY(100%);
        transform-style: preserve-3d;
        perspective: 40rem;
      }
    }
    .form {
      display: contents;
    }
    .login-btn {
      align-self: end;
      justify-self: end;
      margin-bottom: 0.125rem;
    }
    .vertical {
      position: absolute;
      height: 2.25rem;
      width: fit-content;
      white-space: pre;
      padding-left: 2rem;
      transform-origin: left center;
      rotate: y 0deg;
      background-color: var(--n-200);
      box-shadow:
        1px 0 2px hsla(0, 0%, 0%, 0.2),
        2px 0 4px hsla(0, 0%, 0%, 0.1),
        4px 0 8px hsla(0, 0%, 0%, 0.06);
      &.enter {
        animation: foldin 0.5s cubic-bezier(0, 0.55, 0.45, 1);
      }
      &.leave {
        animation: foldout 0.5s cubic-bezier(0.55, 0, 1, 0.45);
      }
      &.new,
      &.back {
        top: 0;
      }
      &.forgot {
        top: 2.75rem;
      }
    }
    @keyframes foldin {
      from {
        background: linear-gradient(270deg, var(--n-600), var(--n-200) 75%) right center / 400% 100%;
        rotate: y 90deg;
        background-position: 100% 0%;
      }
      to {
        background: linear-gradient(270deg, var(--n-600), var(--n-200) 75%) right center / 400% 100%;
        rotate: y 0deg;
        background-position: 0% 0%;
      }
    }
    @keyframes foldout {
      from {
        background: linear-gradient(270deg, var(--n-200), black 75%) right center / 400% 100%;
        rotate: y 0deg;
      }
      to {
        color: var(--n-200);
        background: linear-gradient(270deg, var(--n-200), black 75%) right center / 400% 100%;
        rotate: y -90deg;
      }
    }
  `,
})
export class LoginPageComponent {
  private apiService = inject(ApiService);

  protected readonly IconEnum = IconEnum;
  protected readonly PageState = PageState;
  protected title = 'Notes';

  pageState = PageState.Login;

  emailFieldState = InputState.Default;
  emailFieldHelpText = '';

  passwordFieldState = InputState.Default;
  passwordFieldHelpText = '';

  profileForm = new FormGroup({
    email: new FormControl('conny@carneval.com', [Validators.required, Validators.email]),
    password: new FormControl('123456', [Validators.required, Validators.minLength(6)]),
  });

  helpText = (errors: ValidationErrors | null): string => {
    const key = Object.keys(errors ?? [])?.[0];
    if (typeof key === 'string') {
      return (
        {
          required: 'Field is required.',
          email: 'Entry needs to be a valid email.',
          minlength: 'Entry needs to be atleast 6 charcters long.',
        }?.[key] ?? ''
      );
    } else return '';
  };

  updateState(state: PageState) {
    this.pageState = state;
    if (PageState.Forgot === state) this.title = 'Forgot Password';
    else if (PageState.NewUser === state) this.title = 'New User';
    else this.title = 'Notes';
  }

  login(): void {
    this.profileForm.updateValueAndValidity();

    if (this.profileForm.valid) {
      const raw = this.profileForm.getRawValue();
      if (this.pageState === PageState.Login) {
        this.apiService.login(raw.email!, raw.password!);
      } else if (this.pageState === PageState.NewUser) {
        this.apiService.createUser(raw.email!, raw.password!);
      }
    }
  }
}
