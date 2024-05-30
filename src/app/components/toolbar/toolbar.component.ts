import { Component } from '@angular/core';

@Component({
  selector: 'pno-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  
  stateOptions = [{ label: 'upper', value: true }, { label: 'lower', value: false }];
  value = true;
  isFullscreen = false;

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
