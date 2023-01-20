import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import nebula from '../img/nebula.jpeg'

const renderer = new Three.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement)

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 0, 12)
orbit.update()

const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_resolution: {
    type: 'v2',
    value: new Three.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio)
  },
  u_mouse: {
    type: 'v2',
    value: new Three.Vector2(0, 0)
  },
  image: {
    type: 't',
    value: new Three.TextureLoader().load(nebula)
  }
}

window.addEventListener('mousemove', function (e) {
  uniforms.u_mouse.value.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
})

const geometry = new Three.PlaneGeometry(10, 10, 30, 30)
const material = new Three.ShaderMaterial({
  vertexShader: document.querySelector('#vertexShader').textContent,
  fragmentShader: document.querySelector('#fragmentShader').textContent,
  wireframe: false,
  uniforms
})
const mesh = new Three.Mesh(geometry, material)
scene.add(mesh)

const clock = new Three.Clock()

function animate() {
  uniforms.u_time.value = clock.getElapsedTime()

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const gl = renderer.getContext()
const shader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(shader, document.querySelector('#fragmentShader').textContent);
gl.compileShader(shader);
if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
  // alert(gl.getShaderInfoLog(shader))
}