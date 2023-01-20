import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from '../img/stars.jpg';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg';

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

camera.position.set(-90, 140, 140)
orbit.update()

const ambientLight = new Three.AmbientLight(0x333333)
scene.add(ambientLight)

const cubeTextureLoader = new Three.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture
])

const textureLoader = new Three.TextureLoader();

const sunGeo = new Three.SphereGeometry(16, 30, 30);
const sunMat = new Three.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
})
const sun = new Three.Mesh(sunGeo, sunMat)
scene.add(sun)

function createPlanet(size, texture, position, ringOptions) {
  const geo = new Three.SphereGeometry(size, 30, 30);
  const mat = new Three.MeshStandardMaterial({
    map: textureLoader.load(texture)
  })
  const mesh = new Three.Mesh(geo, mat)
  const obj = new Three.Object3D()
  obj.add(mesh)

  if (ringOptions) {
    const ringGeo = new Three.RingGeometry(ringOptions.innerRadius, ringOptions.outerRadius, 32);
    const ringMat = new Three.MeshBasicMaterial ({
      map: textureLoader.load(ringOptions.texture),
      side: Three.DoubleSide
    })
    const ringMesh  = new Three.Mesh(ringGeo, ringMat)
    obj.add(ringMesh)
    ringMesh.position.x = position
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  scene.add(obj)
  mesh.position.x = position
  return { mesh, obj }
}

const mercury = createPlanet(3.2, mercuryTexture, 28)
const venus = createPlanet(5.8, venusTexture, 44)
const earth = createPlanet(6, earthTexture, 62)
const mars = createPlanet(4, marsTexture, 78)
const jupiter = createPlanet(12, jupiterTexture, 100)
const saturn = createPlanet(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture
})
const uranus = createPlanet(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture
})
const neptune = createPlanet(7, neptuneTexture, 200)
const pluto = createPlanet(2.8, plutoTexture, 216)

const pointLight = new Three.PointLight(0xFFFFFF, 2, 300)
scene.add(pointLight)

function rotatePlanetY(planet, absoluteRotation, relativeRotation) {
  planet.mesh.rotateY(absoluteRotation)
  planet.obj.rotateY(relativeRotation)
}

function animate() {
  sun.rotateY(0.004)
  rotatePlanetY(mercury, 0.004, 0.04);
  rotatePlanetY(venus, 0.002, 0.015);
  rotatePlanetY(earth, 0.02, 0.01);
  rotatePlanetY(mars, 0.018, 0.008);
  rotatePlanetY(jupiter, 0.04, 0.002);
  rotatePlanetY(saturn, 0.038, 0.0009);
  rotatePlanetY(uranus, 0.03, 0.0004);
  rotatePlanetY(neptune, 0.032, 0.0001);
  rotatePlanetY(pluto, 0.008, 0.00007);

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})