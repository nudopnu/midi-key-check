import { Injectable } from '@angular/core';
import * as Vex from "vexflow";

@Injectable({
  providedIn: 'root'
})
export class VexflowService {

  constructor() {
    console.log(Vex.Flow);
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
    const { Renderer, Stave, StaveConnector } = Vex.Flow;

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

    const stave = new Stave(20, 10, 300).addClef("treble").addKeySignature("Gb");
    const stave2 = new Stave(20, 120, 300).addClef("bass").addKeySignature("Gb");
    stave.setContext(context);
    stave2.setContext(context);

    const connector = new StaveConnector(stave, stave2);
    connector.setType(StaveConnector.type['BRACE']);
    connector.setContext(context);

    const line = new StaveConnector(stave, stave2);
    line.setType(StaveConnector.type['SINGLE']);
    line.setContext(context);

    const line2 = new StaveConnector(stave, stave2);
    line2.setType(StaveConnector.type['SINGLE_RIGHT']);
    line2.setContext(context);

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
}
