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

camera.position.set(10, 15, -22)
orbit.update()

// const axesHelper = new Three.AxesHelper(20)
// scene.add(axesHelper)

const planeMesh = new Three.Mesh(
  new Three.PlaneGeometry(20, 20),
  new Three.MeshBasicMaterial({
    // color: 0xffffff,
    side: Three.DoubleSide,
    visible: false
  })
)
planeMesh.rotateX(-Math.PI / 2)
planeMesh.name = 'ground'
scene.add(planeMesh)

const grid = new Three.GridHelper(20, 20)
scene.add(grid)

const highlightMesh = new Three.Mesh(
  new Three.PlaneGeometry(1, 1),
  new Three.MeshBasicMaterial({
    // color: 0xffffff,
    side: Three.DoubleSide,
    transparent: true
  })
)
highlightMesh.rotateX(-Math.PI / 2)
highlightMesh.position.set(0.5, 0, 0.5)
scene.add(highlightMesh)

const mouse = new Three.Vector3()
const rayCaster = new Three.Raycaster()
let intersects;

function getIntersect() {
  return rayCaster.intersectObjects(scene.children).find(i => i.object.name === 'ground')
}

window.addEventListener('mousemove', function (e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  rayCaster.setFromCamera(mouse, camera)
  intersects = rayCaster.intersectObjects(scene.children)

  const intersect = getIntersect();
  if (intersect) {
    document.querySelector('body').style.cursor = 'pointer';

    const highlightPos = new Three.Vector3().copy(intersect.point).floor().addScalar(0.5)
    highlightMesh.position.set(highlightPos.x, 0, highlightPos.z)

    if (spheres.find(isHighlightedShpere)) {
      highlightMesh.material.color.setHex(0xff0000)
    } else {
      highlightMesh.material.color.setHex(0xffffff)
    }
  } else {
    document.querySelector('body').style.cursor = 'default';
  }
})

const sphereMesh = new Three.Mesh(
  new Three.SphereGeometry(0.4, 4, 2),
  new Three.MeshBasicMaterial({
    wireframe: true,
    color: 0xffea00
  })
)

let spheres = []

function isHighlightedShpere(sphere) {
  return sphere.position.x === highlightMesh.position.x
    && sphere.position.z === highlightMesh.position.z
}

window.addEventListener('mousedown', function () {
  if (getIntersect()) {
    const foundSphere = spheres.find(isHighlightedShpere)
    if (foundSphere) {
      spheres = spheres.filter(sphere => !isHighlightedShpere(sphere));
      scene.remove(foundSphere)

      highlightMesh.material.color.setHex(0xffffff)
      return;
    }

    const sphereClone = sphereMesh.clone()
    sphereClone.position.copy(highlightMesh.position)
    scene.add(sphereClone)
    spheres.push(sphereClone)

    highlightMesh.material.color.setHex(0xff0000)
  }
})

function animate(time) {
  highlightMesh.material.opacity = 1 + Math.sin(time / 240)
  spheres.forEach(sphere => {
    sphere.rotation.x = time / 1000
    sphere.rotation.z = time / 1000
    sphere.position.y = 0.5 + 0.5 * Math.abs(Math.sin(time / 1000))
  })

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})
