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

export function midiToPitchValue(midi: number) {
    return midi % 12 as PitchValue;
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
