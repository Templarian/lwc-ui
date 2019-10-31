import { LightningElement, api } from 'lwc';
import { updateClass } from '../util';

export default class Flex extends LightningElement {
  @api flex: string | number = 'content';
  @api column: boolean = false;
  @api row: boolean = false;

  connectedCallback() {
    this.template.host.style.flex = `${this.flex}`;
    updateClass(this.classList, {
      'flex-column': this.column,
      'flex-row': this.row
    });
  }
}
