import { LightningElement, api, track } from 'lwc';
import {
    mdiOpenInNew
} from '@mdi/js';

export default class Component extends LightningElement {
    @api name: string = '';
    @api tag: string = '';
    @api file: string = '';

    @track mdiOpenInNew: string = mdiOpenInNew;
    
    get href() {
        return `https://github.com/Templarian/lwc-ui#${this.file}---${this.tag}`;
    }
}