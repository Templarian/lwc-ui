import { LightningElement, api } from 'lwc';

export default class NavItem extends LightningElement {
    @api href: string | null = null;
    @api target: string | null = null;
}