import { LightningElement, api } from 'lwc';
import { handleSlot } from 'ui/util';

interface Slot {
  component: string;
  name: string | null;
  variant: string | null;
}

export default class Icon extends LightningElement {
  _path: string = '';

  @api
  get path() {
    return this._path;
  }
  set path(path: string) {
    this._path = path;
  }

  connectedCallback() {
    this.addEventListener('slot', handleSlot);
  }
}
