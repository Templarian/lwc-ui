import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {
  _width: string = '15rem';
  @api
  get width() {
    return this._width;
  }
  set width(value: string) {
    const ele = this.template.host.childNodes[0] as HTMLElement;
    if (ele) {
      ele.style.width = value;
    }
    this._width = value;
  }

  _height: string = 'auto';
  @api
  get height() {
    return this._height;
  }
  set height(value: string) {
    const ele = this.template.host.childNodes[0] as HTMLElement;
    if (ele) {
      ele.style.height = value;
    }
    this._height = value;
  }

  renderedCallback() {
    const ele = this.template.childNodes[1] as HTMLElement;
    ele.style.width = this.width;
    ele.style.height = this.height;
  }
}
