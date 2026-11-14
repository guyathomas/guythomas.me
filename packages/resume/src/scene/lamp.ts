import * as THREE from 'three';

/**
 * The desk lamp's head: an enamelled shade on an arm that leaves the picture.
 * It hangs above the reading view, so it is only seen when the camera pulls back.
 */
export function createLampHead(): { group: THREE.Group; bulb: THREE.MeshStandardMaterial } {
  const group = new THREE.Group();
  const enamel = new THREE.MeshStandardMaterial({ color: '#1e2a25', roughness: 0.28, metalness: 0.1, side: THREE.DoubleSide });
  const inside = new THREE.MeshStandardMaterial({ color: '#f1ece0', roughness: 0.6, side: THREE.BackSide });
  const profile = [
    [0.014, 0.07],
    [0.019, 0.064],
    [0.03, 0.04],
    [0.052, 0.006],
    [0.054, 0],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const shade = new THREE.Mesh(new THREE.LatheGeometry(profile, 64), enamel);
  const lining = new THREE.Mesh(new THREE.LatheGeometry(profile.map((p) => new THREE.Vector2(p.x - 0.0008, p.y)), 64), inside);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.014, 0.02, 32), new THREE.MeshStandardMaterial({ color: '#b8924f', metalness: 1, roughness: 0.35 }));
  cap.position.y = 0.08;
  const bulb = new THREE.MeshStandardMaterial({ color: '#fff4dc', emissive: '#ffcf8f', emissiveIntensity: 0, roughness: 0.4 });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.017, 24, 16), bulb);
  globe.position.y = 0.03;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.9, 16), new THREE.MeshStandardMaterial({ color: '#b8924f', metalness: 1, roughness: 0.3 }));
  arm.position.set(0, 0.5, 0);
  // Shade opens downward along -Y; tilt the whole head toward what it lights.
  const head = new THREE.Group();
  head.add(shade, lining, cap, globe);
  group.add(head, arm);
  arm.rotation.z = 0.5;
  arm.position.set(-0.22, 0.47, -0.02);
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) child.castShadow = false;
  });
  return { group, bulb };
}
