// import * as lwc from 'lwc';

declare module 'lwc' {

    // register
    export const register: any;

    // createElement
    type ShadowDomMode = 'open' | 'closed';
    interface CreateElementOptions {
        is: ComponentConstructor;
        mode?: ShadowDomMode;
    }
    export function createElement(sel: string, options: CreateElementOptions): HTMLElement;

    // buildCustomElementConstructor
    export interface LightningElementConstructor {
        new (): LightningElement;
        readonly prototype: LightningElement;
    }
    export interface ComponentConstructor extends LightningElementConstructor {
        readonly name: string;
        readonly labels?: string[];
        readonly delegatesFocus?: boolean;
    }
    export interface HTMLElementConstructor {
        prototype: HTMLElement;
        new (): HTMLElement;
    }
    export function buildCustomElementConstructor(
        Ctor: ComponentConstructor,
        options?: ShadowRootInit
    ): HTMLElementConstructor
}