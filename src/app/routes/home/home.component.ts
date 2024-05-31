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

}
