'use strict'

import TweenLite from 'gsap';
import {create} from '../utils/trix';
import '../../styles/controls.scss';

export default class Controls{
    constructor(parent){
        this.container = parent.container;
        this.camera = parent.camera;
        this.parent = parent;
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

        this.rotateUpButton = create('div', this.controlContainer, ['button', 'up']);
        this.rotateUpButton.innerHTML = '⤵︎';
        this.rotateUpButton.addEventListener('click', this.rotateUp.bind(this));

        this.rotateDownButton = create('div', this.controlContainer, ['button', 'up']);
        this.rotateDownButton.innerHTML = '⤴︎';
        this.rotateDownButton.addEventListener('click', this.rotateDown.bind(this));

        this.twObj = {
            y:0,
            i:(Math.PI * 2) * 0.02
        }
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
    rotateUp(){
        this.rotate();
    }
    rotateDown(){
        this.rotate('-=');
    }
    rotate(dir = '+='){
        let startY = this.twObj.y;
        TweenLite.to(this.twObj, 1, {y:dir+this.twObj.i,
        onUpdateParams:['{self}'],
         onUpdate:(t)=>{
            const delta = t.target.y - startY;
            this.parent.group.rotateX(delta);
            startY = t.target.y;
        }})
    }
}