import { LightningElement } from 'lwc';

export default class List extends LightningElement {
  connectedCallback() {
    this.classList.add('variant-border');
  }
}
