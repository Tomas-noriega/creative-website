/**
 * The confirmed Mission 2 model (Venture 3D Studio → Venture_3D_Confirmed_Handoff.zip),
 * shown as a live Three.js scene in the hero.
 *
 * Three.js 0.169.0 is loaded from jsDelivr at runtime (see the import map in
 * index.html) instead of being bundled, so the site keeps its current
 * dependencies and build. Everything here is plain
 * Three.js; the React side only mounts it into a div and drives the controls.
 */

const BASE = import.meta.env.BASE_URL;
export const MODEL_DIR = `${BASE}media/reel-lifts-3d/`;

/* Three.js is loaded at runtime, so its objects are typed loosely here. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export type Manifest = {
  schemaVersion: string;
  projectName: string;
  modelName: string;
  modelType: string;
  confirmedAt: string;
  dimensions: {width: number; height: number; depth: number; units: string};
  camera: {position: number[]; target: number[]; type: string};
  background: string;
  lighting: string;
  description: string;
  hotspots: {name: string; description: string; position: number[]}[];
  files: {model: string};
  integrity?: {algorithm: string; modelChecksum: string; modelBytes: number};
};

export type Feature = {id: string; mesh: string; title: string; body: string; at: 'top' | 'upper'};

/** The two hotspots in the confirmed manifest, anchored to the parts they describe. */
export const FEATURES: Feature[] = [
  {id: 'rim', mesh: 'Glowing rim', title: 'The icon frame', body: 'App icon frame that makes the brand recognizable.', at: 'top'},
  {id: 'lifter', mesh: 'Male lifter', title: 'Film the top set', body: 'Lifters film their heaviest sets on their phones.', at: 'upper'},
];

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

async function load(path: string): Promise<Any> {
  return import(/* @vite-ignore */ path);
}

export type Stage = {
  /** Points in CSS pixels inside the mount for each feature, or null when hidden. */
  project(): Record<string, {x: number; y: number} | null>;
  rotateBy(dx: number, dy: number): void;
  zoom(step: number): void;
  reset(): void;
  focus(id: string | null): void;
  setActive(on: boolean): void;
  setReveal(t: number): void;
  dispose(): void;
  manifest: Manifest;
};

export async function createStage(mount: HTMLElement, opts: {reducedMotion: boolean; onFrame?: () => void}): Promise<Stage> {
  const [THREE, {GLTFLoader}, {RoomEnvironment}, {EffectComposer}, {RenderPass}, {UnrealBloomPass}, {OutputPass}] = await Promise.all([
    load('three'),
    load('three/addons/loaders/GLTFLoader.js'),
    load('three/addons/environments/RoomEnvironment.js'),
    load('three/addons/postprocessing/EffectComposer.js'),
    load('three/addons/postprocessing/RenderPass.js'),
    load('three/addons/postprocessing/UnrealBloomPass.js'),
    load('three/addons/postprocessing/OutputPass.js'),
  ]);

  const manifest: Manifest = await fetch(`${MODEL_DIR}model-manifest.json`).then((r) => {
    if (!r.ok) throw new Error('manifest missing');
    return r.json();
  });
  const buf: ArrayBuffer = await fetch(`${MODEL_DIR}${manifest.files.model}`).then((r) => {
    if (!r.ok) throw new Error('model missing');
    return r.arrayBuffer();
  });
  const gltf = await new GLTFLoader().parseAsync(buf, '');

  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false, powerPreference: 'high-performance'});
  const small = window.matchMedia('(max-width: 767px)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(manifest.background || '#0c0b09');
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  // "Gold rim" lighting from the studio, as named in the manifest.
  scene.add(new THREE.AmbientLight('#ffffff', 0.35));
  const lights: [string, number, number[]][] = [
    ['#ffd070', 3, [-6, 8, 9]],
    ['#ffb000', 5, [-9, 3, -4]],
    ['#ffb000', 5, [9, 4, -4]],
    ['#fff0c8', 1.6, [4, 3, 12]],
  ];
  lights.forEach(([c, i, p], n) => {
    const d = new THREE.DirectionalLight(c, i);
    d.position.set(p[0], p[1], p[2]);
    if (n === 0) {
      d.castShadow = true;
      d.shadow.mapSize.set(1024, 1024);
      d.shadow.bias = -0.0005;
    }
    scene.add(d);
  });

  // Center the confirmed model on the origin; its real size stays as exported.
  const pivot = new THREE.Group();
  const model = gltf.scene;
  model.traverse((o: Any) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  pivot.add(model);
  scene.add(pivot);

  // Shadow catcher just under the stand.
  const lights0 = scene.children.find((c: Any) => c.isDirectionalLight && c.castShadow);
  lights0.shadow.camera.left = lights0.shadow.camera.bottom = -size.x;
  lights0.shadow.camera.right = lights0.shadow.camera.top = size.x;
  lights0.position.multiplyScalar(size.y / 4);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(size.x * 6, size.x * 6), new THREE.ShadowMaterial({opacity: 0.4}));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -size.y / 2 - 0.0005;
  floor.receiveShadow = true;
  scene.add(floor);

  // Frame it from the manifest's confirmed camera direction, at a distance that fills the stage.
  const camera = new THREE.PerspectiveCamera(30, 1, size.y / 50, size.y * 40);
  const dir = new THREE.Vector3(...(manifest.camera?.position ?? [0, 0, 1])).sub(new THREE.Vector3(...(manifest.camera?.target ?? [0, 0, 0])));
  if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
  dir.normalize();
  const fit = (Math.max(size.x, size.y) / 2 / Math.tan((camera.fov * Math.PI) / 360)) * 1.18;
  const zoomLimits = [fit * 0.55, fit * 1.35];
  let dist = fit;
  let wantDist = fit;

  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, {type: THREE.HalfFloatType, samples: 4}));
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), 0.2, 0.5, 1.05));
  composer.addPass(new OutputPass());

  const resize = () => {
    const w = mount.clientWidth || 1;
    const h = mount.clientHeight || 1;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(mount);
  resize();

  // Orientation: yaw/pitch of the model, eased toward a target.
  const REST = {yaw: 0, pitch: 0};
  let yaw = 0.35;
  let pitch = 0;
  let want = {...REST};
  let lastTouch = 0;
  let reveal = 0;
  let active = true;
  let raf = 0;
  let focusId: string | null = null;

  const anchors: Record<string, Any> = {};
  FEATURES.forEach((f) => {
    const mesh = model.getObjectByName(f.mesh) ?? model.getObjectByName(f.mesh.replace(/ /g, '_'));
    if (!mesh) return;
    const b = new THREE.Box3().setFromObject(mesh);
    const c = b.getCenter(new THREE.Vector3());
    const p = f.at === 'top' ? new THREE.Vector3(c.x + (b.max.x - b.min.x) * 0.18, b.max.y, b.max.z) : new THREE.Vector3(c.x + (b.max.x - b.min.x) * 0.22, c.y + (b.max.y - b.min.y) * 0.28, b.max.z);
    const holder = new THREE.Object3D();
    holder.position.copy(pivot.worldToLocal(p));
    pivot.add(holder);
    anchors[f.id] = holder;
  });

  const tick = (t: number) => {
    raf = requestAnimationFrame(tick);
    if (!active) return;
    const idle = !opts.reducedMotion && !focusId && performance.now() - lastTouch > 4000;
    const sway = idle ? Math.sin(t / 2600) * 0.32 : 0;
    const k = opts.reducedMotion ? 1 : 0.08;
    yaw += (want.yaw + sway - yaw) * k;
    pitch += (want.pitch - pitch) * k;
    dist += (wantDist - dist) * k;
    pivot.rotation.set(pitch, yaw, 0);
    const r = 1 - Math.pow(1 - reveal, 3);
    pivot.scale.setScalar(0.86 + 0.14 * r);
    camera.position.copy(dir).multiplyScalar(dist);
    camera.lookAt(0, 0, 0);
    composer.render();
    opts.onFrame?.();
  };
  raf = requestAnimationFrame(tick);

  const v = new THREE.Vector3();
  return {
    manifest,
    project() {
      const out: Record<string, {x: number; y: number} | null> = {};
      for (const f of FEATURES) {
        const a = anchors[f.id];
        if (!a) {
          out[f.id] = null;
          continue;
        }
        a.getWorldPosition(v);
        const facing = v.clone().sub(camera.position).dot(new THREE.Vector3().copy(dir).negate()) > 0 && Math.abs(Math.sin(yaw)) < 0.75;
        v.project(camera);
        out[f.id] = facing ? {x: ((v.x + 1) / 2) * mount.clientWidth, y: ((1 - v.y) / 2) * mount.clientHeight} : null;
      }
      return out;
    },
    rotateBy(dx, dy) {
      lastTouch = performance.now();
      focusId = null;
      want = {yaw: want.yaw + dx * 0.008, pitch: Math.max(-0.45, Math.min(0.45, want.pitch + dy * 0.005))};
    },
    zoom(step) {
      lastTouch = performance.now();
      wantDist = Math.max(zoomLimits[0], Math.min(zoomLimits[1], wantDist * (step > 0 ? 0.82 : 1.22)));
    },
    reset() {
      lastTouch = 0;
      focusId = null;
      want = {...REST};
      wantDist = fit;
    },
    focus(id) {
      focusId = id;
      lastTouch = performance.now();
      want = {...REST};
      wantDist = id === 'lifter' ? fit * 0.72 : fit;
    },
    setActive(on) {
      active = on;
    },
    setReveal(t) {
      reveal = Math.max(0, Math.min(1, t));
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      pmrem.dispose();
      renderer.domElement.remove();
    },
  };
}
