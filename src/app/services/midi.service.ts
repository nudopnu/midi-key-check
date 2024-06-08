import { Injectable } from '@angular/core';
import { NotesService } from './notes.service';

type PedalName = 'sustain' | 'sustenuto' | 'soft' | 'unknown';

type MidiEvent = {
  type: 'noteOn' | 'noteOff' | 'pedalOn' | 'pedalOff' | 'controlChange';
  channel: number;
  pedalName?: PedalName;
  midi?: number;
  velocity?: number;
  controllerNumber?: number;
  controllerValue?: number;
};

/**
 * Parses an array of raw MIDI bytes into structured MIDI events.
 * @param midiBytes Array of MIDI byte messages.
 * @returns Array of structured MIDI events.
 */
function parseMidiBytes(midiBytes: Uint8Array): MidiEvent[] {
  const events: MidiEvent[] = [];
  let i = 0;
  while (i < midiBytes.length) {
    const statusByte = midiBytes[i];
    const messageType = statusByte & 0xf0; // Mask out the lower 4 bits to get the message type
    const channel = (statusByte & 0x0f) + 1; // Get the channel and adjust by 1 to make it 1-indexed
    i++;

    switch (messageType) {
      case 0x90: // Note On
        const noteOnNumber = midiBytes[i++];
        const noteOnVelocity = midiBytes[i++];
        if (noteOnVelocity > 0) {  // Velocity of 0 is actually a Note Off in some contexts
          events.push({
            type: 'noteOn',
            channel,
            midi: noteOnNumber,
            velocity: noteOnVelocity,
          });
        } else {
          events.push({
            type: 'noteOff',
            channel,
            midi: noteOnNumber
          });
        }
        break;
      case 0x80: // Note Off
        const noteOffNumber = midiBytes[i++];
        const noteOffVelocity = midiBytes[i++];  // Often ignored, but included for completeness
        events.push({
          type: 'noteOff',
          channel,
          midi: noteOffNumber
        });
        break;
      case 0xB0: // Control Change
        const controllerNumber = midiBytes[i++];
        const controllerValue = midiBytes[i++];
        if (controllerNumber == 64 || controllerNumber === 66 || controllerNumber == 67) {
          const pedalType = controllerValue >= 64 ? 'pedalOn' : 'pedalOff';
          let pedalName = 'unknown' as PedalName;
          switch (controllerNumber) {
            case 64:
              pedalName = 'sustain';
              break;
            case 66:
              pedalName = 'sustenuto';
              break;
            case 67:
              pedalName = 'soft';
              break;
          }
          events.push({
            type: pedalType,
            pedalName,
            channel,
            controllerNumber,
            controllerValue
          })
        } else {
          events.push({
            type: 'controlChange',
            channel,
            controllerNumber,
            controllerValue
          });
        }
        console.log(events[events.length - 1]);
        break;
      // Add cases for other relevant MIDI messages as needed
    }
  }
  return events;
}


@Injectable({
  providedIn: 'root'
})
export class MidiService {

  constructor(
    private notesService: NotesService,
  ) {
    navigator.permissions.query({ name: "midi", sysex: true } as any).then((result) => {
      if (result.state === "granted") {
        // Access granted.
        this.requestMidiAccess();
      } else if (result.state === "prompt") {
        // Using API will prompt for permission
        this.requestMidiAccess();
      }
      // Permission was denied by user prompt or permission policy
    });
  }

  private async requestMidiAccess() {
    const midiAccess = await navigator.requestMIDIAccess();
    midiAccess.onstatechange = () => {
      this.listenForInputs(midiAccess);
    };
    this.listenForInputs(midiAccess);
  }

  private listenForInputs(midiAccess: MIDIAccess) {
    const inputs = midiAccess.inputs;
    if (Object.keys(inputs).length === 0) return;
    inputs.forEach((entry) => {
      entry.onmidimessage = (event) => this.onMidiMessage(event);
    });
  }

  private onMidiMessage(event: MIDIMessageEvent) {
    if (!event.data || event.data.byteLength === 1) return;
    const midiEvents = parseMidiBytes(event.data);
    for (const midiEvent of midiEvents) {
      switch (midiEvent.type) {
        case 'noteOn':
          this.notesService.pressed.set([...this.notesService.pressed(), midiEvent.midi!]);
          break;
        case 'noteOff':
          this.notesService.pressed.set(this.notesService.pressed().filter(midi => midi !== midiEvent.midi));
          break;
        case 'pedalOn':
          if (midiEvent.pedalName !== "soft") break;
          this.notesService.upperStave.set(!this.notesService.upperStave());
          break;
        case 'controlChange':
          break;
      }
    }
  }
}
