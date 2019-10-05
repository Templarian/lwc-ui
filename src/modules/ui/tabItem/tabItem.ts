import { LightningElement, api } from 'lwc';
import { updateClass } from '../util';

export default class TabItem extends LightningElement {
  @api
  show() {
    updateClass(this.template.host.classList, {
      hide: false
    });
  }

  @api
  hide() {
    updateClass(this.template.host.classList, {
      hide: true
    });
  }
}
