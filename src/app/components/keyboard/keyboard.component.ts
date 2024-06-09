import { Component, computed } from '@angular/core';
import { isBlackKey, midiToOctave, midiToPitchName } from '../../core/music/utils';
import { NotesService } from '../../services/notes.service';
import { SoundSynthesizerService } from '../../services/sound-synthesizer.service';


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
    pressed: this.notesService.state().pressed.indexOf(21 + index) !== -1,
  })));

  constructor(
    private notesService: NotesService,
    private soundSynthesizerService: SoundSynthesizerService,
  ) { }

  onClick(key: { midi: number; isBlack: boolean; name: string; pressed: boolean; }) {
    const pressed = this.notesService.state().pressed;
    if (pressed.indexOf(key.midi) === -1) {
      this.notesService.set('pressed', [...pressed, key.midi]);
      this.soundSynthesizerService.playPianoKey(key.midi);
    } else {
      this.notesService.set('pressed', pressed.filter(midi => midi !== key.midi));
    }
  }
}
