import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MidiService {

  constructor() {
    navigator.permissions.query({ name: "midi", sysex: true } as any).then((result) => {
      if (result.state === "granted") {
        // Access granted.
        navigator.requestMIDIAccess().then((access) => {
          // Get lists of available MIDI controllers
          const inputs = access.inputs
          const outputs = access.outputs

          console.log(inputs, outputs);
          inputs.forEach((entry) => {
            entry.onmidimessage = console.log;
          });
        });
      } else if (result.state === "prompt") {
        // Using API will prompt for permission
      }
      // Permission was denied by user prompt or permission policy
    });
  }

}
