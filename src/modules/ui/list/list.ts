import { LightningElement } from 'lwc';

export default class List extends LightningElement {
  connectedCallback() {
    this.template.host.classList.add('variant-border');
  }
}