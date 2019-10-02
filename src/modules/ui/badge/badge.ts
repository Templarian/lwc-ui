import { LightningElement } from 'lwc';
import { handleSlot } from 'ui/util';

export default class Badge extends LightningElement {
  connectedCallback() {
    this.addEventListener('slot', handleSlot);
  }
}
