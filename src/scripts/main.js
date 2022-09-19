import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three-orbitcontrols/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

const width = window.innerWidth,
    height = window.innerHeight;

// Create a renderer and add it to the DOM.
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias:true
});
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(width, height);
// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xFEFEFE );

// Create a camera
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.y = 15;
scene.add(camera);

// Create a light, set its position, and add it to the scene.
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add(light);

const directionalLight = new THREE.PointLight( 0xffffff, 1, 100 );
directionalLight.castShadow = true; // default false
directionalLight.position.y = 10;
scene.add( directionalLight );

const directionalLight2 = new THREE.PointLight( 0xffffff, 1, 100 );
directionalLight2.castShadow = true; // default false
directionalLight2.position.y = -10;
scene.add( directionalLight2 );

//hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
//scene.add(hemiLight);

// Add OrbitControls so that we can pan around with the mouse.
const controls = new THREE.OrbitControls(camera, canvas);

// Instantiate a loader
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
  // resource URL
  'hache.glb',
  // called when the resource is loaded
  function ( gltf ) {
    gltf.scene.traverse( function( node ) {
        if ( node.isMesh ) { node.castShadow = true; }
        if ( node.isMesh || node.isLight ) node.receiveShadow = true;
    } );
    scene.add( gltf.scene );

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
    gltf.scene.scale.set(15,15,15)

console.log(gltf.scene);
    // Renders the scene
    function animate() {
      renderer.render( scene, camera );
      //controls.update();

      console.log(gltf.scene.size);
      gltf.scene.rotation.x += 1;
      requestAnimationFrame( animate );
    }

  },
  // called while loading is progressing
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  },
  // called when loading has errors
  function ( error ) {

    console.log( 'An error happened' );

  }
);


resize();
animate();
window.addEventListener('resize',resize);

function resize(){
  let w = window.innerWidth;
  let h = window.innerHeight;

  renderer.setSize(w,h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// Renders the scene
function animate() {
  renderer.render( scene, camera );
  //controls.update();
  camera.rotation.z += 0.001;
  requestAnimationFrame( animate );
}

