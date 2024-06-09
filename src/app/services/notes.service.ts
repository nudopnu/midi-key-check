import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';
import { PitchName } from '../core/music/utils';

type WritableSignalValue<T> = T extends WritableSignal<infer U> ? U : never;

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  state = computed(() => Object.fromEntries(
    Object.entries(this._state).map(([key, signal]) => [key, signal()])
  )) as Signal<{ [key in keyof typeof this._state]: ReturnType<typeof this._state[key]> }>;

  private _state = {
    pressed: signal([] as number[]),
    upperStave: signal(true),
    key: signal("C" as PitchName),
  };

  constructor() {
    const key = this.load('key');
    if (!key) return;
    this.set('key', key);
  }

  set<T extends keyof typeof this._state>(state: T, value: WritableSignalValue<ReturnType<Signal<(typeof this._state)>>[T]>) {
    const newLocal = this._state[state] as WritableSignal<WritableSignalValue<ReturnType<Signal<(typeof this._state)>>[T]>>;
    newLocal.set(value);
    if (state !== 'key') return;
    this.persist(state, value);
  }

  private persist<T extends keyof typeof this._state>(key: T, value: WritableSignalValue<ReturnType<Signal<(typeof this._state)>>[T]>) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private load<T extends keyof typeof this._state>(key: T): WritableSignalValue<ReturnType<Signal<(typeof this._state)>>[T]> | undefined {
    const stringValue = localStorage.getItem(key);
    return stringValue && JSON.parse(stringValue);
  }

}
