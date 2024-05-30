export const PitchClass = {
    0: ['C'],
    1: ['Db', 'C#'],
    2: ['D'],
    3: ['Eb', 'D#'],
    4: ['E'],
    5: ['F'],
    6: ['Gb'],
    7: ['G'],
    8: ['Ab', 'G#'],
    9: ['A'],
    10: ['Bb', 'A#'],
    11: ['B'],
} as const;

type PitchClassType = typeof PitchClass;
export type PitchValue = keyof PitchClassType;
export type PitchName = PitchClassType[PitchValue][number];

export const Mode = {
    Ionian: [2, 2, 1, 2, 2, 2, 1],
    Dorian: [2, 1, 2, 2, 2, 1, 2],
    Phrygian: [1, 2, 2, 2, 1, 2, 2],
    Lydian: [2, 2, 2, 1, 2, 2, 1],
    Mixolydian: [2, 2, 1, 2, 2, 1, 2],
    Aeolian: [2, 1, 2, 2, 1, 2, 2],
    Locrian: [1, 2, 2, 1, 2, 2, 2],
} as const;

type ModeType = typeof Mode;
export type ModeName = keyof ModeType;
export type ModeDistances<T> = T extends ModeName ? ModeType[T] : never;

export class Key {
    constructor(name: PitchName, mode: ModeName) { }
}

export function midiToPitchValue(midi: number) {
    return midi % 12 as PitchValue;
}

export function midiToOctave(midi:number) {
    return Math.floor(midi / 12);
}

export function pitchValueToName(pitchValue: PitchValue) {
    return PitchClass[pitchValue][0];
}

export function midiToPitchName(midi: number) {
    return pitchValueToName(midiToPitchValue(midi));
}

export function isBlackKey(midi: number) {
    return pitchValueToName(midiToPitchValue(midi)).length > 1;
}

export function getModalityDistances<T extends ModeName>(modality: T): ModeDistances<T> {
    return Mode[modality] as ModeDistances<T>;
}