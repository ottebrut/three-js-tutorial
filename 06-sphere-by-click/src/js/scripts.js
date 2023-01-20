import * as Three from 'three';
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

camera.position.set(0, 6, 6)
orbit.update()

const ambientLight = new Three.AmbientLight(0x333333)
scene.add(ambientLight)

const directionalLight = new Three.DirectionalLight(0xffffff, 0.8)
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0)

// const axesHelper = new Three.AxesHelper(20)
// scene.add(axesHelper)

const mouse = new Three.Vector2()
const intersectionPoint = new Three.Vector3()
const planeNormal = new Three.Vector3()
const plane = new Three.Plane()
const rayCaster = new Three.Raycaster()

window.addEventListener('click', function (e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize()
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position)
  rayCaster.setFromCamera(mouse, camera)
  rayCaster.ray.intersectPlane(plane, intersectionPoint)

  const sphereGeo = new Three.SphereGeometry(0.125, 30, 30)
  const sphereMat = new Three.MeshStandardMaterial({
    color: 0xffea00,
    metalness: 0,
    roughness: 0
  })
  const sphereMesh = new Three.Mesh(sphereGeo, sphereMat)
  scene.add(sphereMesh)
  sphereMesh.position.copy(intersectionPoint)
})

function animate() {
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})
