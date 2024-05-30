import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { VexflowService } from '../../services/vexflow.service';
import { MidiService } from '../../services/midi.service';

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
  ) { }

  ngAfterViewInit(): void {
    // this.vexflowService.renderSample(this.notesElementRef.nativeElement.id);
    this.vexflowService.drawBrace(this.notesElementRef.nativeElement);
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
