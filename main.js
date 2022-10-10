import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import spaceImage from './images/space.jpg';
import interstellarImage from './images/interstellar.png';
import moonImage from './images/moon.jpeg';
import normalImage from './images/normal.jpeg';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry( 10,3,16,100 );
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347} );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);

const controls = new OrbitControls(camera, renderer.domElement);

let starArray = [];

function createStar(amount) {
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff});
  for (let i = 0; i < amount; i++) {
    const star = new THREE.Mesh(geometry, material);
    const [y, z] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    const x = THREE.MathUtils.randFloat(-175, 75);
    star.position.set(x, y, z);
    starArray.push(star);
  }
}

createStar(400);

for (let i = 0; i < starArray.length; i++) {
  scene.add(starArray[i]);
}

const spaceTexture = new THREE.TextureLoader().load(spaceImage);
scene.background = spaceTexture;

const interstellarTexture = new THREE.TextureLoader().load(interstellarImage);

const interstellar = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: interstellarTexture})
);

scene.add(interstellar);

const moonTexture = new THREE.TextureLoader().load(moonImage);
const normalTexture = new THREE.TextureLoader().load(normalImage);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 23;
moon.position.setX(-10);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  interstellar.rotation.y += 0.03;
  interstellar.rotation.z += 0.03;

  camera.position.z = t*-0.01;
  camera.position.x = t*-0.0002;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.002;
  moon.rotation.y += 0.001;
  moon.rotation.z += 0.002;

  for (let i = 0; i < starArray.length; i++) {
    starArray[i].translateX(0.01);
  }

  controls.update();

  renderer.render(scene, camera);
}

animate();

function display() {
  document.querySelector('canvas').style.display = "block";
  document.querySelector('main').style.display = "grid";
  document.querySelector('.loader').style.display = "none";
}

let playing = false;
document.querySelector('#music').onclick = function() {
  if (!playing) {
    document.querySelector("#bg_music").play();
    playing = true;
    document.querySelector('.music').style.backgroundColor = "black";
    document.querySelector('.music').style.color = "white";
  } else {
    document.querySelector("#bg_music").pause();
    playing = false;
    document.querySelector('.music').style.backgroundColor = "white";
    document.querySelector('.music').style.color = "black";
  }
}

setTimeout(display, 3000);