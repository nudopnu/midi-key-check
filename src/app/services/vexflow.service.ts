import { Injectable } from '@angular/core';
import * as Vex from "vexflow";
import { Key, PitchName, midiToOctave, midiToPitchName } from '../core/music/utils';
import { GrandStaff } from './GrandStaff';

@Injectable({
  providedIn: 'root'
})
export class VexflowService {

  grandStaff: GrandStaff | undefined;
  element: HTMLDivElement | undefined;
  highlightUpperStave: boolean = true;

  constructor() { }

  init(element: HTMLDivElement, onClick?: ((svgElement: SVGElement, ev: MouseEvent) => any) | null) {
    this.element = element;
    this.grandStaff = new GrandStaff(element, "C");
    if (onClick) {
      this.grandStaff.svgElement.onclick = (event) => onClick(this.grandStaff!.svgElement, event);
    }
  }

  drawMidis(midis: number[], upperStave = true) {
    if (!this.grandStaff) throw new Error('VecflowService not initialized!');
    if (midis.length === 0) return;
    const keys = midis.map(midi => `${midiToPitchName(midi)}/${midiToOctave(midi)}`);
    const notes = [
      new Vex.Flow.StaveNote({ keys, duration: '4', clef: upperStave ? "treble" : "bass" }),
    ];
    this.grandStaff.drawStave();
    this.grandStaff.drawNotes(notes, upperStave);
  }

  setKey(key: string) {
    if (!this.grandStaff || !this.element) throw new Error('VecflowService not initialized!');
    this.grandStaff.setKey(key);
  }

  setHighlight(upperStave: boolean) {
    this.highlightUpperStave = upperStave;
    this.grandStaff!.focusUpperStave = upperStave;
    this.grandStaff?.greyOut(!upperStave);
    console.log("Greying out 0", upperStave);

  }

  drawPianoNotes(element: HTMLDivElement) {
    const notes = [
      new Vex.Flow.StaveNote({ keys: ['c/4'], duration: '4' }),
      new Vex.Flow.StaveNote({ keys: ['d/4'], duration: '4' }),
      new Vex.Flow.StaveNote({ keys: ['a/4'], duration: '4' }),
      new Vex.Flow.StaveNote({ keys: ['b/4'], duration: '4' }),
      new Vex.Flow.StaveNote({ keys: ['c/5'], duration: '4' }),
    ];
    const grandStaff = new GrandStaff(element, "C");
    grandStaff.drawNotes(notes);
  }

  renderLowLevel(element: HTMLDivElement) {
    const { Renderer, Stave } = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element with id="output".
    const renderer = new Renderer(element, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 500);
    const context = renderer.getContext();
    context.setFont('Arial', 10);

    // Create a stave of width 400 at position 10, 40.
    const stave = new Stave(10, 40, 400);

    // Add a clef and time signature.
    stave.addClef('treble').addTimeSignature('4/4');

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
  }

  drawBrace(element: HTMLDivElement) {
    const { Renderer, Stave, StaveConnector, StaveNote, Voice } = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element with id="output".
    const renderer = new Renderer(element, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(330, 250);
    const context = renderer.getContext();
    context.setFont('Arial', 10);

    // Fixing responsive size
    const svgElement = (context as any)['groups'][0] as SVGElement;
    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');
    svgElement.style.setProperty('max-height', '80vh');
    svgElement.style.setProperty('max-width', '90vw');

    // TODO: make to params
    const signature = "Gb";
    const notes = [
      new StaveNote({ keys: ['c/4'], duration: '4' }),
      new StaveNote({ keys: ['d/4'], duration: '4' }),
      new StaveNote({ keys: ['a/4'], duration: '4' }),
      new StaveNote({ keys: ['b/4'], duration: '4' }),
      new StaveNote({ keys: ['c/5'], duration: '4' }),
    ];

    const stave = new Stave(20, 10, 300).addClef("treble").addKeySignature(signature);
    const stave2 = new Stave(20, 120, 300).addClef("bass").addKeySignature(signature);
    stave.setContext(context);
    stave2.setContext(context);

    const voice = new Voice({} as any)
      .setMode(Vex.Flow.Voice.Mode.SOFT)
      .addTickables(notes);
    Vex.Flow.Accidental.applyAccidentals([voice], signature);
    new Vex.Flow.Formatter()
      .joinVoices([voice])
      .formatToStave([voice], stave);


    const connector = new StaveConnector(stave, stave2);
    connector.setType(StaveConnector.type['BRACE']);
    connector.setContext(context);

    const line = new StaveConnector(stave, stave2);
    line.setType(StaveConnector.type['SINGLE']);
    line.setContext(context);

    const line2 = new StaveConnector(stave, stave2);
    line2.setType(StaveConnector.type['SINGLE_RIGHT']);
    line2.setContext(context);

    voice.draw(context, stave);
    stave.draw();
    stave2.draw();
    connector.draw();
    line.draw();
    line2.draw();
  }

  renderSample(elementId: string) {
    const { Factory, EasyScore, System } = Vex.Flow;

    const vf = new Factory({
      renderer: { elementId, width: 500, height: 200 },
    });

    const score = vf.EasyScore();
    const system = vf.System();

    system
      .addStave({
        voices: [
          score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' }), {}),
          score.voice(score.notes('C#4/h, C#4', { stem: 'down' }), {}),
        ],
      })
      .addClef('treble')
      .addTimeSignature('4/4');

    vf.draw();
  }

  renderKeySignature(elementId: string, keySignature: string) {
    const { Factory, EasyScore, System } = Vex.Flow;

    const vf = new Factory({
      renderer: { elementId, width: 130, height: 200 },
    });

    const score = vf.EasyScore();
    const system = vf.System();

    system
      .addStave({ voices: [] })
      .addClef('treble')
      .addKeySignature(keySignature);

    vf.draw();
  }

  renderRests(element: HTMLDivElement) {
    const { Renderer, Stave, StaveConnector, StaveNote, Voice } = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element with id="output".
    const renderer = new Renderer(element, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(330, 250);
    const context = renderer.getContext();
    context.setFont('Arial', 10);

    // Fixing responsive size
    const svgElement = (context as any)['groups'][0] as SVGElement;
    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');
    svgElement.style.setProperty('max-height', '80vh');
    svgElement.style.setProperty('max-width', '90vw');
    const VF = Vex.Flow;
    function newNote(note_struct: any) { return new VF.StaveNote(note_struct); }

    var notes = [
      newNote({ keys: ["b/4"], stem_direction: 1, duration: "wr" }),
      newNote({ keys: ["b/4"], stem_direction: 1, duration: "hr" }),
      newNote({ keys: ["b/4"], stem_direction: 1, duration: "qr" }),
      newNote({ keys: ["b/4"], stem_direction: 1, duration: "8r" }),
      newNote({ keys: ["b/4"], stem_direction: 1, duration: "16r" }),
      newNote({ keys: ["b/4"], stem_direction: 1, duration: "32r" }),
      newNote({ keys: ["b/4"], stem_direction: 1, duration: "64r" })
    ];

    var voice = new VF.Voice({} as any);
    const stave = new Stave(20, 10, 300).addClef("treble");
    stave.setContext(context);

    voice.setStrict(false);
    voice.addTickables(notes);
    stave.addTimeSignature("4/4");
    stave.draw();

    VF.Formatter.FormatAndDraw(context, stave, notes);

    voice.draw(context, stave);
  }
}
