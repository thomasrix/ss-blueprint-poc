'use strict';
import {create, select, normalize} from '../utils/trix';
import '../../styles/blueprint.scss';
import { StreamDrawUsage } from 'three';
import Controls from './controls';
global.THREE = require('three');
require('three/examples/js/controls/OrbitControls');

export default class Blueprint {
    constructor() {
        this.props = {
            gridSize:10,
            size:{
                horisontal:{
                    xCount:10,
                    yCount:5,
                    width:800,
                    height:450,
                    xRange:7.5,
                    zoom:18
                },
                vertical:{
                    xCount:5,
                    yCount:9,
                    width:450,
                    height:800,
                    xRange:2.75,
                    zoom:18
                }
            }
        }
        this.init(this.props);
        
        // this.build();
    }
    init(props){
        this.container = select('[blueprint-scroller]');
        this.canvas = create('canvas', this.container, 'faq-ct-canvas');
        props.context = this.canvas.getContext('webgl');
        
        this.query = window.matchMedia("(max-width: 500px)");
        this.querySwitch(this.query);
        
        this.query.addListener(this.querySwitch.bind(this));
        
        this.build(props);
    }
    querySwitch(q){
        this.orientation = (q.matches) ? 'vertical' : 'horisontal';
        this.setCanvasSize();
        
    }
    setCanvasSize(){
        let {width, height, zoom} = this.props.size[this.orientation];
        this.canvas.width = width;
        this.canvas.height = height;
        if(this.populated){
            // this.emptyGroup();
            // this.populateGroup(this.createGrid());
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.camera.position.z = zoom;
            this.renderer.setSize(width, height);
        }
        
    }
    
    build(props) {
        let {context} = props;
        let {width, height, zoom} = props.size[this.orientation];
        
        this.renderer = new THREE.WebGLRenderer({
            context
        });
        // console.log(this.renderer.domElement);
        // WebGL background color
        this.renderer.gammaFactor = 2.2;
        this.renderer.gammaOutput = true;
        this.renderer.setClearColor('hsl(20, 10%, 20%)', 0);
        this.renderer.setSize(width, height);
        
        // Setup a camera
        // const camera = new THREE.OrthographicCamera();
        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        this.camera.near = 15;
        this.camera.position.z = zoom;
        // this.camera.position.y = -6;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        console.log(this.camera.position);

        this.controls = new Controls(this.container, this.camera);
        // Setup camera controller
        
        // const controls = new THREE.OrbitControls(this.camera, this.canvas);
        // controls.enableZoom = true;
        // controls.enableDamping = true;
        // controls.enablePan = true;
        // controls.enableRotate = true;
        // controls.maxPolarAngle = Math.PI * 0.5;
        // controls.minPolarAngle = Math.PI * 0.5;
        
        // Setup your scene
        const scene = new THREE.Scene();
        // scene.background = new THREE.Color('#1F2939');
        
        scene.add(new THREE.AmbientLight('hsl(0, 0%, 90%)'));
        let d_light = new THREE.PointLight( 0xffffff, 1, 0, 2);
        
        // d_light.castShadow = true;
        d_light.position.set( 10, 15, 7 );
        
        scene.add(d_light);
        // console.log('adding light', d_light);
        
        const textureOne = new THREE.TextureLoader().load( process.env.ASSETS_PATH + 'images/deckplan.png' );
        const textureTwo = new THREE.TextureLoader().load( process.env.ASSETS_PATH + 'images/deckplan2.png' );
        const textureThree = new THREE.TextureLoader().load( process.env.ASSETS_PATH + 'images/deckplan3.png' );
        // set the "color space" of the texture


        textureOne.encoding = THREE.sRGBEncoding;
        textureTwo.encoding = THREE.sRGBEncoding;
        textureThree.encoding = THREE.sRGBEncoding;
        
        // reduce blurring at glancing angles
        textureOne.anisotropy = this.renderer.getMaxAnisotropy();
        textureTwo.anisotropy = this.renderer.getMaxAnisotropy();
        textureThree.anisotropy = this.renderer.getMaxAnisotropy();
        // material.map = texture;
        const material = new THREE.MeshStandardMaterial({
            map:textureOne,
            transparent:true
        }
        );
        const materialTwo = new THREE.MeshStandardMaterial({
            map:textureTwo,
            transparent:true,
        })
        const materialThree = new THREE.MeshStandardMaterial({
            map:textureThree,
            transparent:true,
        })

        
        let plane = new THREE.PlaneGeometry( 22, 7, 2, 2 );
        
        const deckOne = new THREE.Mesh(plane, material);
        const deckTwo = new THREE.Mesh(plane, materialTwo);
        const deckThree = new THREE.Mesh(plane, materialThree);
        // console.log(deckTwo.position);
        deckOne.position.set(0, 0, -3)
        deckThree.position.set(0, 0, 3)
        
        this.group = new THREE.Group();
        
        this.group.add(deckOne);
        this.group.add(deckTwo);
        this.group.add(deckThree);

        this.decks = [deckOne, deckTwo, deckThree];

        this.group.rotateX(-0.2);

        scene.add(this.group);

        const near = 5;
        const far = 18;
        const color = '#1F2939';
        scene.fog = new THREE.Fog(color, near, far);

        // console.log('adding group')
        // camera.lookAt(new THREE.Vector3(0, 0, 20));
        
        // Update the camera
        // camera.updateProjectionMatrix();
        
        // Specify an ambient/unlit colour
        
        const render = ()=>{
            // controls.update();
            // console.log('render')
            // this.renderer.clear();
            // console.log(this.camera.position.distanceTo(this.decks[2].position))
            this.decks.forEach((item)=>{
                const dist = this.camera.position.distanceTo(item.position)
                if(dist > 12) item.material.opacity = 1;
                else if(dist < 9) item.material.opacity = 0;
                else if(dist < 12 && dist > 9){
                    item.material.opacity = normalize(dist, 9, 12);
                }
            })
            this.renderer.render(scene, this.camera);
            requestAnimationFrame(render);
        }
        render();
        
        
    }
    setupThree(){
        
    }
    
}