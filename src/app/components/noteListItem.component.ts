import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Note } from "../../helpers/types";

@Component({
  selector: 'list-item',
  template: `
    <button
      class="list-item"
      (click)="selectNote()"
      base-input
    >
      <div class="list-item-header">
        {{ note.title }}
      </div>
      <div class="list-item-content">
        {{ note.content }}
      </div>
      <div class="list-item-date">
        Updated: {{ updatedAt }}
      </div>
    </button>
  `,
  styles: `
    :host { display: contents; }
    .list-item {
      cursor: pointer;
      background-color: transparent;
      border: none;
      display: grid;
      gap: .325rem;
      line-height: 1.375;
      padding: 1rem;
      place-content: start start;
      text-align: left;
      width: 100%;
      height: min-content;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        inset: 0;
        background-color: transparent;
        transition: background-color .15s;
      }
      &:hover:after {
        background-color: var(--hover-clr);
      }
      &:active:after {
        background-color: var(--action-clr);
      }
    }
    .list-item-header {
      color: var(--header-clr);
      font-size: var(--list-item-font-size);
      font-weight: 700;
      @media (prefers-color-scheme: light) {
        font-weight: 600;
      }
    }
    .list-item-content {
      color: var(--para-clr);
      font-size: var(--list-item-font-size);
      font-weight: 500;
      line-height: var(--list-item-line-height);
      max-height: calc(var(--list-item-line-height) * 4);
      overflow: hidden;
      white-space-collapse: break-spaces;
      position: relative;
      &:before {
        content: "...";
        display: block;
        letter-spacing: .125rem;
        position: absolute;
        padding-left: .5rem;
        height: var(--list-item-line-height);
        width: 100%;
        background: var(--bg-clr);
        transition: background-color .15s;
        top: calc(var(--list-item-line-height) * 3);
        right: 0;
      }

    }
    .list-item-date {
      margin-top: .5rem;
      font-size: .625rem;
      font-weight: 600;
      color: var(--n-400);
    }
  `
})

export class ListItem implements OnInit {
  updatedAt: string = ''
  @Input() note!: Note;
  @Output() onClick = new EventEmitter<Note>();

  ngOnInit(): void {
    this.updatedAt = new Date(this.note.updatedAt).toLocaleDateString(
      'sv-se',
      { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    )
  }

  selectNote = () => {
    this.onClick.emit(this.note);
  }
};
