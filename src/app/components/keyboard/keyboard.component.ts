import { AfterViewInit, Component } from '@angular/core';
import { isBlackKey, midiToOctave, midiToPitchName } from '../../core/music/utils';

declare const piano: any;

@Component({
  selector: 'pno-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class KeyboardComponent implements AfterViewInit {

  keys = [...Array(88)].map((_, index) => ({
    midi: 21 + index,
    isBlack: isBlackKey(21 + index),
    name: midiToPitchName(21 + index) + midiToOctave(21 + index),
    pressed: false,
  }));

  ngAfterViewInit(): void {
    console.log(piano);
    // piano(document.querySelector('piano'), {octaves: 3});
  }

}
