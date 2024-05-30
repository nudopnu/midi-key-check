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
    private distances: ModeType[ModeName];
    private root: number;
    constructor(
        public name: PitchName,
        public mode: ModeName,
    ) {
        this.distances = getModalityDistances(mode);
        this.root = getPitchValue(name)!;
    }
}

export function midiToPitchValue(midi: number) {
    return midi % 12 as PitchValue;
}

export function midiToOctave(midi: number) {
    return Math.floor(midi / 12) - 1;
}

export function pitchValueToName(pitchValue: PitchValue, preferFlat = true) {
    const names = PitchClass[pitchValue];
    return names[preferFlat ? 0 : names.length - 1];
}

// Function to map a PitchName to the corresponding PitchValue (number)
export function getPitchValue(pitchName: PitchName): number | undefined {
    // Iterate through the PitchClass entries to find the pitch name and return its key
    for (const [key, names] of Object.entries(PitchClass)) {
        if ((names as readonly string[]).includes(pitchName)) {
            return parseInt(key);
        }
    }
    // Return undefined if the pitch name is not found
    return undefined;
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