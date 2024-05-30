import { Component, computed } from '@angular/core';
import { isBlackKey, midiToOctave, midiToPitchName } from '../../core/music/utils';
import { NotesService } from '../../services/notes.service';


@Component({
  selector: 'pno-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class KeyboardComponent {

  keys = computed(() => [...Array(88)].map((_, index) => ({
    midi: 21 + index,
    isBlack: isBlackKey(21 + index),
    name: midiToPitchName(21 + index) + midiToOctave(21 + index),
    pressed: this.notesService.pressed().indexOf(21 + index) !== -1,
  })));

  constructor(private notesService: NotesService) { }


}
