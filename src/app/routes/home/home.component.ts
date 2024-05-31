import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { VexflowService } from '../../services/vexflow.service';
import { MidiService } from '../../services/midi.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'pno-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('notes') notesElementRef!: ElementRef;
  isFullscreen = false;
  sidebarVisible = false;
  keys = [
    { major: "C", minor: "A", value: "C", icon: "C" },
    { major: "F", minor: "D", value: "F", icon: "F" },
    { major: "Bb", minor: "G", value: "Bb", icon: "Bb" },
    { major: "Eb", minor: "C", value: "Eb", icon: "Eb" },
    { major: "Ab", minor: "F", value: "Ab", icon: "Ab" },
    { major: "Db", minor: "Bb", value: "Db", icon: "Db" },
    { major: "Gb", minor: "Eb", value: "Gb", icon: "Gb" },
    { major: "Cb", minor: "Ab", value: "Cb", icon: "Cb" },
    { major: "G", minor: "E", value: "G", icon: "G" },
    { major: "D", minor: "B", value: "D", icon: "D" },
    { major: "A", minor: "F#", value: "A", icon: "A" },
    { major: "E", minor: "C#", value: "E", icon: "E" },
    { major: "B", minor: "G#", value: "B", icon: "B" },
    { major: "F#", minor: "D#", value: "F#", icon: "Fs" },
    { major: "C#", minor: "A#", value: "C#", icon: "Cs" },
  ];
  selectedKey = this.keys[0];

  constructor(
    private vexflowService: VexflowService,
    private midiSerivice: MidiService,
    private notesService: NotesService,
  ) {
    toObservable(notesService.pressed).subscribe(pressed => {
      if (pressed.length === 0) return;
      vexflowService.drawMidis(pressed);
    });
  }

  ngAfterViewInit(): void {
    this.vexflowService.init(this.notesElementRef.nativeElement);
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
    this.vexflowService.setKey(key.value);
  }

}
