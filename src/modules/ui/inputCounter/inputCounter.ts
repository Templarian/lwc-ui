import { LightningElement, api, track } from 'lwc';
import {
  mdiPlus,
  mdiMinus
} from '@mdi/js';

export default class InputCounter extends LightningElement {

  @api value: number = 0;
  @api step: number = 1;

  @track mdiPlus: string = mdiPlus;
  @track mdiMinus: string = mdiMinus;

  handlePlusClick() {
    this.value += this.step;
  }

  handleMinusClick() {
    this.value -= this.step;
  }

}