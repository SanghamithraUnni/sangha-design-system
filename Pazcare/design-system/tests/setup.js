import '@testing-library/jest-dom/vitest';
import {cleanup} from '@testing-library/react';import {afterEach,vi} from 'vitest';
afterEach(cleanup);
HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');this.querySelector('input,button')?.focus()};
HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')};
