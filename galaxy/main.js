import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Particles (Stars)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 10000;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 25;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({ size: 0.01, color: 0xffffff });
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Planet 1 (Mars-like)
const planet1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff4500, roughness: 0.7 })
);
scene.add(planet1);

// Planet 2 (Saturn-like)
const planet2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xDAA520, roughness: 0.8 })
);
const rings = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.1, 2, 100),
    new THREE.MeshStandardMaterial({ color: 0xDAA520, side: THREE.DoubleSide, roughness: 0.8 })
);
rings.rotation.x = Math.PI * 0.5;
planet2.add(rings); // Add rings as a child of the planet
scene.add(planet2);


// Mouse interaction
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Animation Loop
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update particles rotation
    particlesMesh.rotation.y = -0.02 * elapsedTime;

    // Update planets
    planet1.rotation.y += 0.005;
    planet1.position.x = Math.sin(elapsedTime * 0.5) * 4;
    planet1.position.z = Math.cos(elapsedTime * 0.5) * 4;

    planet2.rotation.y += 0.002;
    planet2.position.x = Math.sin(elapsedTime * 0.2) * 7;
    planet2.position.z = Math.cos(elapsedTime * 0.2) * 7;

    // Parallax effect
    const parallaxX = (mouseX / window.innerWidth - 0.5) * 2;
    const parallaxY = -(mouseY / window.innerHeight - 0.5) * 2;
    camera.position.x += (parallaxX - camera.position.x) * 0.02;
    camera.position.y += (parallaxY - camera.position.y) * 0.02;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});