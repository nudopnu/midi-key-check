import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { VexflowService } from '../../services/vexflow.service';

@Component({
  selector: 'pno-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('notes') notesElementRef!: ElementRef;

  constructor(private vexflowService: VexflowService) { }

  ngAfterViewInit(): void {
    this.vexflowService.renderSample(this.notesElementRef.nativeElement.id);
  }


}
