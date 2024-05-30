import { Component, Input } from '@angular/core';

@Component({
  selector: 'pno-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  @Input() name!: string;
}
