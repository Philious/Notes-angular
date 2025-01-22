import { Component, inject, Input, OnInit } from "@angular/core";
import { IconButtonComponent } from "./action/iconButton.component";
import { ButtonStyleEnum, IconEnum } from "../../helpers/enum";
import { Note } from "../../helpers/types";
import { NoteService } from "../../services/notes.service";
import { map } from "rxjs";
import { FormsModule, NgModel } from "@angular/forms";

@Component({
  selector: 'note',
  imports: [IconButtonComponent, FormsModule],
  template: `
    <div class="title-area">
      <input
        class="title"
        autofocus
        [(ngModel)]="title"
      />
    </div>
    <div class="date">
      <span>Created: {{ createdDate }}</span>
      <span>Updated: {{ updatedDate }}</span>
    </div>
    <div class="text-area-container">
      <textarea
        class="text-area"
        [(ngModel)]="content"
      ></textarea>
    </div>
    <div class="toolbar">
      <div class="toolbar-left-section">
        <icon-button
          [icon]="IconEnum.Left"
          [buttonStyle]="ButtonStyleEnum.Border"
          (onClick)="cancel()"
        />
        <icon-button
          [icon]="IconEnum.Check"
          [buttonStyle]="ButtonStyleEnum.Border"
          (onClick)="save()"
        />
      </div>
      <div class="toolbar-right-section">
        <icon-button
          [icon]="IconEnum.Options"
          [buttonStyle]="ButtonStyleEnum.Border"
          (onClick)="options()"
        />
      </div>
    </div>
  `,
  styles: `
  :host {
    grid-area: var(--note-area);
    background-color: var(--black);
    position: fixed;
    inset: 0 0 0 var(--note-width);
    display: grid;
    grid-template-rows: auto 1.5rem 1fr;
    z-index: 1;
  }
  .toolbar {
    box-sizing: border-box;
    display: flex;
    height: 3rem;
    align-items: center;
    padding: 0 .5rem;
    justify-content: space-between;
    box-shadow: 0 -0.0625rem 0 var(--n-300);
  }
  .toolbar-left-section,
  .toolbar-right-section {
    display: flex;
    gap: .5rem;
  }
  .title {
    box-sizing: border-box;
    font-size: 1rem;
    height: 3rem;
    padding: 0 0.75rem;
    background-color: transparent;
    border: none;
    width: 100%;
  }
  .date {
    font-size: 0.625rem;
    height: 1.5rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--n-500);
    padding: 0 1rem;
    justify-content: space-between;
    align-items: center;
    display: flex;
    margin: auto 0;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 1rem;
      right: 1rem;
      height: 0.0625rem;

      background-color: var(--n-300);
    }
  }
  .text-area-container {
    margin: 0 .25rem;
  }
  .text-area {
    box-sizing: border-box;
    border: none;
    background: none;
    line-height: 1.5;
    font-size: 0.875rem;
    width: 100%;
    height: 100%;
    padding: 1rem .75rem;
    white-space-collapse: break-spaces;
    overflow-y: auto;
    resize: none;
  }
  `
})

export class NoteComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;
  note: Note;
  title = '';
  content = ''
  createdDate = '';
  updatedDate = '';

  cancel: () => void
  save: () => void
  options: () => void

  constructor(noteService: NoteService) {
    this.cancel = () => { noteService.setActiveNote(null) }
    this.save = () => {
      const id = this.note.id;
      console.log(id);
      if (id) noteService.updateNote({ ...this.note, title: this.title })
      else noteService.addNote({ ...this.note, content: this.title })
      noteService.setActiveNote(null)
    }
    this.options = () => { }
    this.note = noteService.newNote();
    noteService.activeNote$.subscribe(note => {
      if (note) {
        this.note = note;
        this.title = note.title;
        this.content = note.content;
        this.createdDate = new Date(note?.createdAt).toLocaleDateString('sv-se', { year: "2-digit", month: "2-digit", day: "2-digit" });
        this.updatedDate = new Date(note?.createdAt).toLocaleDateString('sv-se', { year: "2-digit", month: "2-digit", day: "2-digit" });
      }
    })
  }
}