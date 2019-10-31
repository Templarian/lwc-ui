import { LightningElement, api } from 'lwc';
import { updateClass } from '../util';

export default class TabItem extends LightningElement {
  @api
  show() {
    updateClass(this.classList, {
      hide: false
    });
  }

  @api
  hide() {
    updateClass(this.classList, {
      hide: true
    });
  }
}
