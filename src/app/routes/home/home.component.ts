import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { PitchName } from '../../core/music/utils';
import { MidiService } from '../../services/midi.service';
import { NotesService } from '../../services/notes.service';
import { VexflowService } from '../../services/vexflow.service';

@Component({
  selector: 'pno-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('notes') notesElementRef!: ElementRef;
  isFullscreen = false;
  sidebarVisible = false;
  keys = [
    { major: "C", minor: "A", value: "C" as PitchName, icon: "C" },
    { major: "F", minor: "D", value: "F" as PitchName, icon: "F" },
    { major: "Bb", minor: "G", value: "Bb" as PitchName, icon: "Bb" },
    { major: "Eb", minor: "C", value: "Eb" as PitchName, icon: "Eb" },
    { major: "Ab", minor: "F", value: "Ab" as PitchName, icon: "Ab" },
    { major: "Db", minor: "Bb", value: "Db" as PitchName, icon: "Db" },
    { major: "Gb", minor: "Eb", value: "Gb" as PitchName, icon: "Gb" },
    { major: "Cb", minor: "Ab", value: "Cb" as PitchName, icon: "Cb" },
    { major: "G", minor: "E", value: "G" as PitchName, icon: "G" },
    { major: "D", minor: "B", value: "D" as PitchName, icon: "D" },
    { major: "A", minor: "F#", value: "A" as PitchName, icon: "A" },
    { major: "E", minor: "C#", value: "E" as PitchName, icon: "E" },
    { major: "B", minor: "G#", value: "B" as PitchName, icon: "B" },
    { major: "F#", minor: "D#", value: "F#" as PitchName, icon: "Fs" },
    { major: "C#", minor: "A#", value: "C#" as PitchName, icon: "Cs" },
  ];
  selectedKey = this.keys[0];
  subscription: Subscription;

  constructor(
    private vexflowService: VexflowService,
    private midiSerivice: MidiService,
    private notesService: NotesService,
  ) {
    this.subscription = toObservable(notesService.state)
      .subscribe(({ pressed, key, upperStave }) => {
        vexflowService.setKey(key);
        vexflowService.setHighlight(upperStave);
        vexflowService.drawMidis(pressed, upperStave);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.vexflowService.init(this.notesElementRef.nativeElement, (element, event) => {
      const { y, height } = element.getBoundingClientRect();
      const onUpperHalf = y + height / 2 >= event.clientY;
      this.notesService.set('upperStave', onUpperHalf);
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.isFullscreen = true;
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  setKey(key: (typeof this.keys)[number]) {
    this.notesService.set('key', key.value);
  }

}
