'use strict'

import TweenLite from 'gsap';
import {create} from '../utils/trix';
import '../../styles/controls.scss';

export default class Controls{
    constructor(container, camera){
        this.container = container;
        this.camera = camera;
        this.build();
    }
    build(){
        this.controlContainer = create('div', this.container, ['controls']);

        this.leftButton = create('div', this.controlContainer, ['button', 'left']);
        this.leftButton.innerHTML = '>';
        this.leftButton.addEventListener('click', this.left.bind(this));

        this.forwardButton = create('div', this.controlContainer, ['button', 'forward']);
        this.forwardButton.innerHTML = '>';
        this.forwardButton.addEventListener('click', this.forward.bind(this));

        this.backButton = create('div', this.controlContainer, ['button', 'back']);
        this.backButton.innerHTML = '>';
        this.backButton.addEventListener('click', this.back.bind(this));

        this.rightButton = create('div', this.controlContainer, ['button', 'right']);
        this.rightButton.innerHTML = '>';
        this.rightButton.addEventListener('click', this.right.bind(this));
    }
    forward(){
        TweenLite.to(this.camera.position, 1, {z:'-=2.5'});
    }
    back(){
        TweenLite.to(this.camera.position, 1, {z:'+=2.5'});
    }
    left(){
        TweenLite.to(this.camera.position, 1, {x:'-=2'});
    }
    right(){
        TweenLite.to(this.camera.position, 1, {x:'+=2'});
    }
}