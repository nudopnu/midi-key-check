import * as Vex from "vexflow";
import { Key } from "../core/music/utils";

export class GrandStaff {

  private renderer: any;
  private context: any;
  private line: any;
  private line2: any;
  private stave: any;
  private stave2: any;
  private connector: any;

  constructor(private element: HTMLDivElement, private key: Key) {
    const { Renderer } = Vex.Flow;
    this.renderer = new Renderer(this.element, Renderer.Backends.SVG);
    this.renderer.resize(330, 250);

    // Configure the rendering context.
    this.context = this.renderer.getContext();
    this.context.setFont('Arial', 10);

    // Fixing responsive size
    const svgElement = this.context['groups'][0] as SVGElement;
    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');
    svgElement.style.setProperty('max-height', '70vh');
    svgElement.style.setProperty('max-width', '90vw');

    this.initStave();
  }

  private initStave() {
    const { Stave, StaveConnector } = Vex.Flow;

    const signature = this.key.name;
    this.stave = new Stave(20, 10, 300).addClef("treble").addKeySignature(signature);
    this.stave2 = new Stave(20, 120, 300).addClef("bass").addKeySignature(signature);
    this.stave.setContext(this.context);
    this.stave2.setContext(this.context);

    this.connector = new StaveConnector(this.stave, this.stave2);
    this.connector.setType(StaveConnector.type['BRACE']);
    this.connector.setContext(this.context);

    this.line = new StaveConnector(this.stave, this.stave2);
    this.line.setType(StaveConnector.type['SINGLE']);
    this.line.setContext(this.context);

    this.line2 = new StaveConnector(this.stave, this.stave2);
    this.line2.setType(StaveConnector.type['SINGLE_RIGHT']);
    this.line2.setContext(this.context);
  }

  drawNotes(notes: any[], upperStave = true) {
    const { Voice } = Vex.Flow;

    const signature = this.key.name;
    const targetStave = upperStave ? this.stave : this.stave2;
    notes.forEach(note => note.setStave(targetStave))

    const voice = new Voice({} as any)
      .setMode(Vex.Flow.Voice.Mode.SOFT)
      .addTickables(notes);
    Vex.Flow.Accidental.applyAccidentals([voice], signature);
    new Vex.Flow.Formatter()
      .joinVoices([voice])
      .formatToStave([voice], targetStave);

    this.context.clear();
    this.stave.draw();
    this.stave2.draw();
    this.connector.draw();
    this.line.draw();
    this.line2.draw();
    voice.draw(this.context, targetStave);
  }
}


