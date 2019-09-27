import { LightningElement, api } from 'lwc';

interface Slot {
  component: string,
  name: string | null,
  variant: string | null
}

export default class Tile extends LightningElement {

  _path: string = '';

  @api
  get path() {
    return this._path;
  }
  set path(path: string) {
    this._path = path;
  }

  connectedCallback() {
    this.addEventListener('slot', this.slot as EventListener);
  }

  slot({ target, detail: slot }: CustomEvent<Slot>) {
    const iconElement = target as Element;
    const slotName = slot.name ? `-${slot.name}` : '';
    const classes = [
      `${slot.component}-variant-${slot.variant}`,
      `${slot.component}-slot${slotName}`
    ];
    iconElement.className = classes.join(' ');
  }

}
