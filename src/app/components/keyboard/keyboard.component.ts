import { AfterViewInit, Component } from '@angular/core';
import { isBlackKey, midiToPitchName } from '../../core/music/utils';

declare const piano: any;

@Component({
  selector: 'pno-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class KeyboardComponent implements AfterViewInit {

  keys = [...Array(10)].map((_, index) => ({
    midi: 180 + index,
    isBlack: isBlackKey(180 + index),
    name: midiToPitchName(180 + index),
  }));

  ngAfterViewInit(): void {
    console.log(piano);

    // piano(document.querySelector('piano'), {octaves: 3});
  }

}
