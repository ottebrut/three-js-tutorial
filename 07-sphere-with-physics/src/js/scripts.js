import * as Three from 'three';
import * as Cannon from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new Three.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight)

renderer.shadowMap.enabled = true

document.body.appendChild(renderer.domElement)

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 5, 10)
orbit.update()

const ambientLight = new Three.AmbientLight(0x333333)
scene.add(ambientLight)

const directionalLight = new Three.DirectionalLight(0xffffff, 0.8)
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

const planeGeo = new Three.PlaneGeometry(10, 10)
const planeMat = new Three.MeshStandardMaterial({
  color: 0xffffff
})
const planeMesh = new Three.Mesh(planeGeo, planeMat)
scene.add(planeMesh)
planeMesh.receiveShadow = true

const mouse = new Three.Vector2()
const intersectionPoint = new Three.Vector3()
const planeNormal = new Three.Vector3()
const plane = new Three.Plane()
const rayCaster = new Three.Raycaster()

const spheres = []
const spherePhysMat = new Cannon.Material()

window.addEventListener('click', function (e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize()
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position)
  rayCaster.setFromCamera(mouse, camera)
  rayCaster.ray.intersectPlane(plane, intersectionPoint)

  const sphereGeo = new Three.SphereGeometry(0.125, 30, 30)
  const sphereMat = new Three.MeshStandardMaterial({
    color: 0xffffff * Math.random(),
    metalness: 0,
    roughness: 0
  })
  const sphereMesh = new Three.Mesh(sphereGeo, sphereMat)
  scene.add(sphereMesh)
  sphereMesh.castShadow = true

  const sphereBody = new Cannon.Body({
    shape: new Cannon.Sphere(0.125),
    mass: 1,
    position: intersectionPoint,
    material: spherePhysMat
  })
  sphereBody.linearDamping = 0.31
  world.addBody(sphereBody)

  spheres.push({
    mesh: sphereMesh,
    body: sphereBody
  })
})

const world = new Cannon.World({
  gravity: new Cannon.Vec3(0, -9.81, 0)
})

const planePhysMat = new Cannon.Material();
const planeBody = new Cannon.Body({
  shape: new Cannon.Box(new Cannon.Vec3(5, 5, 0.001)),
  type: Cannon.Body.STATIC,
  material: planePhysMat,
  position: new Three.Vector3(0, -2, 0)
})
world.addBody(planeBody)
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

const planeSphereContactMat = new Cannon.ContactMaterial(
  planePhysMat,
  spherePhysMat,
  {
    friction: 0.5,
    restitution: 0.3
  }
)
world.addContactMaterial(planeSphereContactMat)

const timeStep = 1 / 60;

function animate() {
  planeMesh.position.copy(planeBody.position)
  planeMesh.quaternion.copy(planeBody.quaternion)

  spheres.forEach(sphere => {
    sphere.mesh.position.copy(sphere.body.position)
    sphere.mesh.quaternion.copy(sphere.body.quaternion)
  })

  world.step(timeStep)
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})
