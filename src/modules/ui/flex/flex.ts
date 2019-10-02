import { LightningElement, api } from 'lwc';

export default class Flex extends LightningElement {
  @api flex: string | number = 'content';

  connectedCallback() {
    this.template.host.style.flex = `${this.flex}`;
  }
}
