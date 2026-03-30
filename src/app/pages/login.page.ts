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
          <button btn class="vertical back" text-btn (click)="updateState(PageState.Login)">
            Back
          </button>
        }
        @if (pageState === PageState.Login) {
          <button btn class="vertical new" text-btn (click)="updateState(PageState.NewUser)">
            New User
          </button>
        }
        @if (pageState === PageState.Login) {
          <button btn class="vertical forgot" text-btn (click)="updateState(PageState.Forgot)">
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
      gap: 1rem 0;
      place-content: center;
      width: 100vw;
      height: 100vh;
      padding: 2rem;
      max-width: 20rem;
      margin: auto;
      grid-template-rows: 1fr repeat(3, 3.375rem) 1fr min-content;
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
      }
      .update-email-btn {
        transform: translateY(calc(-100% - 0.75rem));
      }
      .forgot {
        .action-btn {
          transform: translateY(-4.325rem);
        }
        .password {
          opacity: 0;
          transform: translateY(-4.325rem) scale(0);
        }
      }
    }
    .form {
      display: contents;
    }
    .login-btn {
      align-self: end;
      justify-self: end;
    }
    .buttons {
      display: grid;
      grid-template-columns: repeat(2, 3rem);
      position: relative;
      height: 6rem;
      width: 6rem;
      justify-content: flex-start;
      transform: scale(-1);
      overflow: hidden;
      transform-style: preserve-3d;
      perspective: 40rem;
    }
    .vertical {
      position: absolute;
      writing-mode: vertical-rl;
      transform-origin: top;
      text-align: left;
      height: 6rem;
      top: 0;
      white-space: pre;
      &.back,
      &.new {
        right: -0.75rem;
      }
      &.forgot {
        right: 2.25rem;
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
