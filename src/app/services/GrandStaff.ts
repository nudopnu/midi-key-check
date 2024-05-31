import * as Vex from "vexflow";

export class GrandStaff {

  focusUpperStave = true;
  svgElement: SVGElement;
  private renderer: any;
  private context: any;
  private line: any;
  private line2: any;
  private stave: any;
  private stave2: any;
  private connector: any;

  constructor(private element: HTMLDivElement, private signature: string) {
    const { Renderer } = Vex.Flow;
    this.renderer = new Renderer(this.element, Renderer.Backends.SVG);
    this.renderer.resize(330, 250);

    // Configure the rendering context.
    this.context = this.renderer.getContext();
    this.context.setFont('Arial', 10);

    // Fixing responsive size
    this.svgElement = this.context['groups'][0] as SVGElement;
    this.svgElement.removeAttribute('width');
    this.svgElement.removeAttribute('height');
    this.svgElement.style.setProperty('max-height', '70vh');
    this.svgElement.style.setProperty('max-width', '90vw');

    this.initStave();
    this.drawStave();
  }

  greyOut(upperstave = false) {
    const staves = this.svgElement.querySelectorAll('.vf-stave');
    const clefs = this.svgElement.querySelectorAll('.vf-clef');
    const keySignatures = this.svgElement.querySelectorAll('.vf-keysignature');

    const upperStave = staves[0];
    const lowerStave = staves[1];
    const upperClef = clefs[0];
    const lowerClef = clefs[1];
    const upperKeySignature = keySignatures[0];
    const lowerKeySignature = keySignatures[1];

    const upperColor = upperstave ? '#c3c3c3' : '#000';
    const lowerColor = upperstave ? '#000' : '#c3c3c3';
    upperKeySignature.setAttribute('fill', upperColor);
    upperStave.setAttribute('stroke', upperColor);
    upperClef.setAttribute('fill', upperColor);
    lowerKeySignature.setAttribute('fill', lowerColor);
    lowerStave.setAttribute('stroke', lowerColor);
    lowerClef.setAttribute('fill', lowerColor);
  }

  private initStave() {
    const { Stave, StaveConnector } = Vex.Flow;

    this.stave = new Stave(20, 10, 300).addClef("treble").addKeySignature(this.signature);
    this.stave2 = new Stave(20, 120, 300).addClef("bass").addKeySignature(this.signature);
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

  drawStave() {
    this.context.clear();
    this.stave.draw();
    this.stave2.draw();
    this.connector.draw();
    this.line.draw();
    this.line2.draw();
    this.greyOut(!this.focusUpperStave);
  }

  drawNotes(notes: any[], upperStave = true) {
    const { Voice } = Vex.Flow;

    const targetStave = upperStave ? this.stave : this.stave2;
    notes.forEach(note => note.setStave(targetStave))

    const voice = new Voice({} as any)
      .setMode(Vex.Flow.Voice.Mode.SOFT)
      .addTickables(notes);
    Vex.Flow.Accidental.applyAccidentals([voice], this.signature);
    new Vex.Flow.Formatter()
      .joinVoices([voice])
      .formatToStave([voice], targetStave);

    voice.draw(this.context, targetStave);
  }

  setKey(signature: string) {
    this.signature = signature;
    this.context.clear();
    this.initStave();
    this.drawStave();
  }

}


