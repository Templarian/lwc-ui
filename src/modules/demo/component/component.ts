import { LightningElement, api, track } from 'lwc';
import {
    mdiOpenInNew,
    mdiFileDocument
} from '@mdi/js';

export default class Component extends LightningElement {
    @api name: string = '';
    @api tag: string = '';
    @api file: string = '';

    @track mdiOpenInNew: string = mdiOpenInNew;
    @track mdiFileDocument: string = mdiFileDocument;
    
    get docHref() {
        const tagNoHyphen = this.tag.replace(/-/g, '');
        return `https://github.com/Templarian/lwc-ui#${tagNoHyphen}---${this.tag}`;
    }

    get codeHref() {
        return `https://github.com/Templarian/lwc-ui/tree/master/src/modules/ui/${this.file}`;
    }
}