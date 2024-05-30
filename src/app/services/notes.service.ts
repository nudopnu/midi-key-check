import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  pressed = signal([] as number[]);

}
