import * as Three from 'three';
import * as Cannon from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new Three.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 20, -30)
orbit.update()

const boxGeo = new Three.BoxGeometry(2, 2, 2);
const boxMat = new Three.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true
})
const boxMesh = new Three.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const sphereGeo = new Three.SphereGeometry(2);
const sphereMat = new Three.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
})
const sphereMesh = new Three.Mesh(sphereGeo, sphereMat);
scene.add(sphereMesh);

const groundGeo = new Three.PlaneGeometry(30, 30);
const groundMat = new Three.MeshBasicMaterial({
  color: 0xffffff,
  side: Three.DoubleSide,
  wireframe: true
})
const groundMesh = new Three.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const world = new Cannon.World({
  gravity: new Cannon.Vec3(0, -9.81, 0)
})

const groundPhysMat = new Cannon.Material()

const groundBody = new Cannon.Body({
  // shape: new Cannon.Plane(),
  shape: new Cannon.Box(new Cannon.Vec3(15, 15, 0.1)),
  type: Cannon.Body.STATIC,
  material: groundPhysMat
})
world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

const boxPhysMat = new Cannon.Material()

const boxBody = new Cannon.Body({
  mass: 2,
  shape: new Cannon.Box(new Cannon.Vec3(1, 1, 1)),
  position: new Cannon.Vec3(2, 20, 0),
  material: boxPhysMat
})
world.addBody(boxBody);
boxBody.angularVelocity.set(0, 10, 0)

const groundBoxContactMat = new Cannon.ContactMaterial(
  groundPhysMat,
  boxPhysMat,
  {
    friction: 0.5
  }
)
world.addContactMaterial(groundBoxContactMat)

const spherePhysMat = new Cannon.Material()

const sphereBody = new Cannon.Body({
  mass: 1,
  shape: new Cannon.Sphere(2),
  position: new Cannon.Vec3(0, 10, 0),
  material: spherePhysMat
})
world.addBody(sphereBody);
sphereBody.linearDamping = 0.31

const groundSphereContactMat = new Cannon.ContactMaterial(
  groundPhysMat,
  spherePhysMat,
  {
    friction: 1,
    restitution: 0.9
  }
)
world.addContactMaterial(groundSphereContactMat)

const timeStep = 1 / 60;

function animate() {
  world.step(timeStep);

  groundMesh.position.copy(groundBody.position);
  groundMesh.quaternion.copy(groundBody.quaternion);
  boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);
  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})
