import { buildCustomElementConstructor, register } from 'lwc';
import { registerWireService } from '@lwc/wire-service';
import DemoApp from 'demo/app';

registerWireService(register);

customElements.define('demo-app', buildCustomElementConstructor(DemoApp));
