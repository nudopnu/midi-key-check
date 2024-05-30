import { Component } from '@angular/core';
import { Mode, PitchClass } from '../../core/music/utils';

@Component({
  selector: 'pno-modepicker',
  templateUrl: './modepicker.component.html',
  styleUrl: './modepicker.component.scss'
})
export class ModepickerComponent {
  selectedMode = 'C';
  modes = Object.values(PitchClass).flatMap(name => ({ name }));
}
