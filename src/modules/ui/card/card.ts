import { LightningElement, api } from 'lwc';

export default class Card extends LightningElement {

  _shadow: number = 0;

  @api
  get shadow() {
    return this._shadow;
  }
  set shadow(value) {
    this._shadow = value;
    this.updateHostClass();
  }

  updateHostClass() {
    this.template.host.classList.remove(`shadow-1`);
    this.template.host.classList.remove(`shadow-2`);
    this.template.host.classList.remove(`shadow-3`);
    this.template.host.classList.add(`shadow-${this._shadow}`);
  }

}