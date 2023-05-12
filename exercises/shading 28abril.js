import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";
import { ConeGeometry, CylinderGeometry } from '../build/three.module.js';

let scene, renderer, camera, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// createTeapot

  let teaPot = new TeapotGeometry(0.5);
  let material = new THREE.MeshPhongMaterial({color:'red', shininess:"200"});
    material.side = THREE.DoubleSide;
  let obj = new THREE.Mesh(teaPot, material);
    obj.castShadow = true;
    obj.position.set(2.0, 0.5, 0.0);
  scene.add(obj);

// createCone
  let cone = new CylinderGeometry(0.2, 2, 4, 10, 12 );
  let material1 = new THREE.MeshPhongMaterial({color:'green', shininess:"200"});
    material1.side = THREE.DoubleSide;
  let obj1 = new THREE.Mesh(cone, material1);
    obj1.castShadow = true;
    obj1.position.set(-2.0, 2, 0.0);
    scene.add(obj1);

// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}