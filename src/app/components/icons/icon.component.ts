import { Component, Input, Type, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconEnum } from '../../../helpers/enum';
import { AddIconComponent } from './add.component';
import { ArrowLeftIconComponent } from './arrow-left.component';
import { CheckIconComponent } from './check.component';
import { LetterSizeIconComponent } from './letter-size.component';
import { ListIconComponent } from './list.component';
import { LogoutIconComponent } from './logout.component';
import { OptionsIconComponent } from './options.component';
import { RemoveIconComponent } from './remove.component';
import { SettingsIconComponent } from './settings.component';
import { ArrowRightIconComponent } from './arrow-right.component';
import { ArrowUpIconComponent } from './arrow-up.component';
import { ArrowDownIconComponent } from './arrow-down.component';

@Component({
  selector: 'icon',
  imports: [CommonModule],
  template: `
      <ng-container *ngComponentOutlet="getComponent()" />
  `,
  styles: `
    :host { display: contents; } 
    .icn {
      fill: CurrentColor;
      display: block;
      width: 1.5rem;
      height: 1.5rem;
    }
  `,
  encapsulation: ViewEncapsulation.None
})
export class IconComponent {
  @Input() icon!: IconEnum;
  // Map the enum to the corresponding icon components
  private readonly icons: Record<IconEnum, Type<unknown>> = {
    [IconEnum.Add]: AddIconComponent,
    [IconEnum.Down]: ArrowDownIconComponent,
    [IconEnum.Cancel]: RemoveIconComponent,
    [IconEnum.Remove]: RemoveIconComponent,
    [IconEnum.Left]: ArrowLeftIconComponent,
    [IconEnum.List]: ListIconComponent,
    [IconEnum.Options]: OptionsIconComponent,
    [IconEnum.Right]: ArrowRightIconComponent,
    [IconEnum.Setting]: SettingsIconComponent,
    [IconEnum.Up]: ArrowUpIconComponent,
    [IconEnum.Check]: CheckIconComponent,
    [IconEnum.LetterSize]: LetterSizeIconComponent,
    [IconEnum.LogOut]: LogoutIconComponent,
  };

  getComponent() {
    return this.icons[this.icon]
  }

}
