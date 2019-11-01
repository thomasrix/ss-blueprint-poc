'use strict';
import {create, select} from '../utils/trix';
import '../../styles/blueprint.scss';

export default class Blueprint {
    constructor() {
        this.build();
    }

    build() {

        let container = select('[blueprint-scroller]');

        // container.innerHTML = '';

        let content = create('div', container, ['canvas-container']);

        // content.innerHTML = this.testHTML();

    }
    setupThree(){
        
    }

}