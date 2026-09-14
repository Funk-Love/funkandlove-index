import * as THREE from "three";
import gsap from "gsap";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { readPalette } from "@/lib/palette";

export interface VinylScene {
  spin(): void;
  setPlayer(open: boolean, immediate?: boolean): void;
  setPlaying(playing: boolean): void;
  setActive(active: boolean): void;
  dispose(): void;
}

/** A single, demand-rendered product scene. All geometry and material details are local. */
export async function createVinylScene(host: HTMLElement, signal: AbortSignal, studio = false, reduced = false): Promise<VinylScene> {
  const palette = readPalette();
  const capture = new URLSearchParams(location.search).has("capture-hero");
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power", preserveDrawingBuffer: capture });
  renderer.setPixelRatio(capture ? 1 : Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.className = "vinyl-canvas";
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2.6, 2.6, 2.6, -2.6, 0.1, 30);
  camera.position.set(0, 0, 8);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.5;
  room.dispose();
  pmrem.dispose();

  const object = new THREE.Group();
  object.rotation.set(-0.13, -0.28, -0.12);
  object.position.set(0, -0.02, 0);
  scene.add(object);
  const ownedTextures: THREE.Texture[] = [];
  const finish = new THREE.MeshStandardMaterial({ color: palette.paper, roughness: 0.95 });
  const sleeve = new THREE.Mesh(new THREE.BoxGeometry(2.56, 2.75, 0.035), finish);
  sleeve.position.set(-0.56, -0.09, -0.12);
  sleeve.rotation.z = 0.075;
  sleeve.castShadow = true;
  sleeve.receiveShadow = true;
  object.add(sleeve);

  // Print directly onto the paper sleeve: team identity, two ink colors, generous unprinted stock.
  const artwork = document.createElement("canvas");
  artwork.width = 1024; artwork.height = 1100;
  const paper = artwork.getContext("2d")!;
  paper.fillStyle = palette.paper; paper.fillRect(0, 0, 1024, 1100);
  paper.fillStyle = palette.accent; paper.fillRect(0, 0, 1024, 16);
  paper.fillStyle = palette.ink;
  paper.font = "700 112px Arial, sans-serif";
  paper.fillText("FUNK", 68, 155); paper.fillText("& LOVE", 68, 265);
  paper.font = "24px Arial, sans-serif";
  paper.fillText("LOCK IT. POINT IT. GROOVE IT.", 73, 330);
  paper.strokeStyle = palette.ink; paper.lineWidth = 2;
  paper.beginPath(); paper.moveTo(72, 948); paper.lineTo(950, 948); paper.stroke();
  paper.font = "26px Arial, sans-serif"; paper.fillText("ZJU DFM", 72, 1008);
  paper.fillStyle = palette.accent; paper.fillRect(72, 1060, 320, 10);
  // A subtle, deterministic stock texture; no image downloads or animated noise.
  let seed = 37;
  for (let i = 0; i < 18000; i++) {
    seed = (seed * 16807) % 2147483647;
    const x = seed % 1024;
    seed = (seed * 16807) % 2147483647;
    paper.fillStyle = i % 2 ? "rgba(70,45,20,.035)" : "rgba(255,255,255,.10)";
    paper.fillRect(x, seed % 1100, 1, 1);
  }
  const print = new THREE.CanvasTexture(artwork);
  print.colorSpace = THREE.SRGBColorSpace;
  print.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  ownedTextures.push(print);
  // Print belongs to the sleeve material, not a near-coplanar overlay that can self-occlude.
  const inkVisibility = { value: 1 };
  finish.map = print;
  finish.color.set("#ffffff");
  finish.onBeforeCompile = shader => {
    shader.uniforms.uInkVisibility = inkVisibility;
    shader.uniforms.uStock = { value: new THREE.Color(palette.paper) };
    shader.fragmentShader = "uniform float uInkVisibility;\nuniform vec3 uStock;\n" + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>",
      "#include <map_fragment>\ndiffuseColor.rgb = mix(uStock, diffuseColor.rgb, uInkVisibility);");
  };

  const record = new THREE.Group();
  record.position.set(0.47, 0.12, 0.08);
  object.add(record);
  const edge = new THREE.Mesh(new THREE.CylinderGeometry(1.53, 1.53, 0.055, 192), new THREE.MeshStandardMaterial({ color: "#111210", roughness: 0.3, metalness: 0.18 }));
  edge.rotation.x = Math.PI / 2;
  edge.castShadow = true;
  record.add(edge);

  // Tangential anisotropy follows the cut grooves, while the light stays in world space.
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const angle = Math.atan2(y - size / 2, x - size / 2) + Math.PI / 2;
    const i = (y * size + x) * 4;
    data[i] = Math.round((Math.cos(angle) * .5 + .5) * 255);
    data[i + 1] = Math.round((Math.sin(angle) * .5 + .5) * 255);
    data[i + 2] = 255; data[i + 3] = 255;
  }
  const anisotropy = new THREE.DataTexture(data, size, size);
  anisotropy.needsUpdate = true;
  ownedTextures.push(anisotropy);
  const vinyl = new THREE.MeshPhysicalMaterial({ color: "#090a08", roughness: 0.39, metalness: 0.08, anisotropy: 0.7, anisotropyMap: anisotropy, clearcoat: 0.06, clearcoatRoughness: 0.4 });
  vinyl.onBeforeCompile = (shader) => {
    shader.vertexShader = "varying vec2 vGrooveUv;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <uv_vertex>", "#include <uv_vertex>\nvGrooveUv = uv;");
    shader.fragmentShader = "varying vec2 vGrooveUv;\n" + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>",
      "#include <roughnessmap_fragment>\nfloat radius = length(vGrooveUv - vec2(.5));\nfloat footprint = fwidth(radius) * 2400.0;\nfloat rings = sin(radius * 2400.0) * (1.0 - smoothstep(.8, 3.14, footprint));\nroughnessFactor *= .94 + .06 * rings;\ndiffuseColor.rgb *= .98 + .02 * rings;");
  };
  const face = new THREE.Mesh(new THREE.RingGeometry(0.034, 1.522, 192), vinyl);
  face.position.z = 0.029;
  record.add(face);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.523, 0.008, 8, 192), new THREE.MeshStandardMaterial({ color: "#4d4940", metalness: 0.4, roughness: 0.4 }));
  rim.position.z = 0.027;
  record.add(rim);

  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = labelCanvas.height = 768;
  const label = labelCanvas.getContext("2d")!;
  label.fillStyle = palette.accent; label.fillRect(0, 0, 768, 768);
  label.fillStyle = palette.paper;
  label.beginPath(); label.arc(384, 384, 355, 0, Math.PI * 2); label.fill();
  label.strokeStyle = palette.ink; label.lineWidth = 1.5;
  label.beginPath(); label.arc(384, 384, 324, 0, Math.PI * 2); label.stroke();
  label.fillStyle = palette.ink; label.textAlign = "center";
  label.font = "700 58px Arial, sans-serif"; label.fillText("FUNK & LOVE", 384, 185);
  label.font = "700 42px Arial, sans-serif"; label.fillText("LOCKING  /  ZJU DFM", 384, 616);
  const logo = new Image();
  const logoReady = new Promise<void>((resolve) => { logo.onload = () => resolve(); logo.onerror = () => resolve(); });
  logo.src = "/icon-black.png";
  await logoReady;
  if (signal.aborted) {
    renderer.dispose(); environment.dispose();
    scene.traverse((node) => { if (node instanceof THREE.Mesh) { node.geometry.dispose(); const materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach(m => m.dispose()); } });
    ownedTextures.forEach(texture => texture.dispose());
    throw new DOMException("Scene cancelled", "AbortError");
  }
  if (logo.naturalWidth) label.drawImage(logo, 260, 248, 248, 248);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  labelTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  ownedTextures.push(labelTexture);
  const labelMesh = new THREE.Mesh(new THREE.CircleGeometry(.60, 128), new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 0.91 }));
  labelMesh.position.z = .031;
  record.add(labelMesh);

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(32, 32), new THREE.ShadowMaterial({ opacity: .14, depthWrite: false }));
  shadow.position.z = -.28;
  shadow.receiveShadow = true;
  // Keep the receiver behind the sleeve in LOCAL space, including during pointer tilt.
  // A fixed world-space plane intersects the tilted paper and can occlude its print.
  object.add(shadow);
  const key = new THREE.DirectionalLight("#fff1d8", 2.2);
  key.position.set(-3, 4, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -3; key.shadow.camera.right = 3;
  key.shadow.camera.top = 3; key.shadow.camera.bottom = -3;
  key.shadow.normalBias = .015; key.shadow.radius = 3;
  scene.add(key);
  const fill = new THREE.DirectionalLight("#dde7ef", 0.7);
  fill.position.set(3, -1, 4); scene.add(fill);

  let active = true;
  let disposed = false;
  let playerOpen = false;
  let playing = false;
  let width = 0;
  let height = 0;
  const transition = { value: 0 };
  let turn: gsap.core.Tween | undefined;
  let rotationLoop: gsap.core.Tween | undefined;
  let recordSlot: HTMLElement | null = null;
  let recordTarget = { x: 0, y: 0, diameter: 190 };
  const measureRecordSlot = () => {
    const slot = host.closest('.hero-studio')?.querySelector<HTMLElement>('.deck-record-space');
    if (!slot) return;
    if (recordSlot !== slot) { recordSlot = slot; observer.observe(slot); }
    // Layout offsets deliberately exclude the UI's entrance transform.
    let x = 0, y = 0;
    let node: HTMLElement | null = slot;
    while (node && !node.classList.contains('hero-studio')) {
      x += node.offsetLeft; y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    recordTarget = { x: x + slot.clientWidth / 2, y: y + slot.clientHeight / 2,
      diameter: Math.max(1, Math.min(slot.clientWidth - 32, slot.clientHeight - 16)) };
  };
  const render = () => { if (!disposed && active) renderer.render(scene, camera); };
  // World units are 100 CSS pixels in the studio. Both states share these meshes.
  const pose = () => {
    if (!studio || !width || !height) return;
    const p = transition.value;
    const narrow = innerWidth < 768;
    const square = narrow ? Math.min(width * .96, 360) : Math.min(innerWidth * .42, innerHeight * .60, 576);
    const startScale = square / 480;
    const startX = narrow ? width * .51 : width - square / 2 - 12;
    const startY = narrow ? square / 2 + 4 : height / 2;
    const lerp = THREE.MathUtils.lerp;
    object.position.set(lerp((startX - width / 2) / 100, 0, p), lerp((height / 2 - startY) / 100, 0, p), 0);
    object.scale.setScalar(lerp(startScale, 1, p));
    object.rotation.set(lerp(-.13, 0, p), lerp(-.28, 0, p) - Math.sin(p * Math.PI) * .35, lerp(-.12, 0, p));
    const boardWidth = (width - (narrow ? 8 : 24)) / 100;
    const boardHeight = (height - 16) / 100;
    sleeve.position.x = lerp(-.56, 0, p);
    sleeve.position.y = lerp(-.09, 0, p);
    sleeve.rotation.z = lerp(.075, 0, p);
    sleeve.scale.set(lerp(1, boardWidth / 2.56, p), lerp(1, boardHeight / 2.75, p), 1);
    inkVisibility.value = 1 - THREE.MathUtils.smoothstep(p, .08, .6);
    const diameter = recordTarget.diameter;
    const endX = (recordTarget.x - width / 2) / 100;
    const endY = (height / 2 - recordTarget.y) / 100;
    record.position.set(lerp(.47, endX, p), lerp(.12, endY, p), .08 + Math.sin(p * Math.PI) * .7);
    record.scale.setScalar(lerp(1, diameter / 306, p));
    renderer.shadowMap.needsUpdate = true;
    host.dataset.playerProgress = p.toFixed(2);
  };
  const resize = () => {
    if (disposed) return;
    ({ width, height } = host.getBoundingClientRect());
    if (!width || !height) return;
    renderer.setSize(capture ? 1080 : width, capture ? 1080 : height, false);
    const aspect = width / height;
    camera.left = studio ? -width / 200 : -2.4 * aspect;
    camera.right = -camera.left;
    camera.top = studio ? height / 200 : 2.4; camera.bottom = -camera.top;
    key.shadow.camera.left = camera.left - 1; key.shadow.camera.right = camera.right + 1;
    key.shadow.camera.top = camera.top + 1; key.shadow.camera.bottom = camera.bottom - 1;
    key.shadow.camera.updateProjectionMatrix();
    camera.updateProjectionMatrix(); measureRecordSlot(); pose(); render();
  };
  host.appendChild(renderer.domElement);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  // The rotating disc has a circular silhouette. Recompute shadows only when its pose changes.
  renderer.shadowMap.autoUpdate = false;
  // Export the rendered canvas through a DOM image in the explicit capture view.
  // The production view never allocates this extra bitmap.
  const exported = capture ? document.createElement("img") : null;
  if (exported) {
    exported.hidden = true;
    exported.alt = "";
    exported.dataset.vinylExport = "true";
    exported.src = renderer.domElement.toDataURL("image/png");
    host.appendChild(exported);
  }
  let pointerTween: gsap.core.Tween | undefined;
  const pointer = (event: PointerEvent) => {
    if (!active || capture || reduced || playerOpen || turn?.isActive() || event.pointerType === "touch") return;
    const rect = host.closest("section")!.getBoundingClientRect();
    const x = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width - .5, -.5, .5);
    const y = THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height - .5, -.5, .5);
    pointerTween?.kill();
    pointerTween = gsap.to(object.rotation, { x: -.13 + y * .12, y: -.28 + x * .16, duration: .65, ease: "power3.out", onUpdate: () => { renderer.shadowMap.needsUpdate = true; render(); } });
  };
  const hero = host.closest("section")!;
  hero.addEventListener("pointermove", pointer as EventListener, { passive: true });
  let intro = capture || reduced ? null : gsap.from(record.rotation, { z: -.25, duration: 1.4, ease: "power3.out", onUpdate: render, onComplete: render });
  let spinTween: gsap.core.Tween | undefined;
  const syncRotation = () => {
    if (playing && playerOpen && !reduced && active) {
      if (!rotationLoop) {
        intro?.kill(); spinTween?.kill();
        rotationLoop = gsap.to(record.rotation, { z: `-=${Math.PI * 2}`, duration: 8, repeat: -1, ease: "none", onUpdate: render });
      }
    } else {
      // Release the old starting angle so playback resumes from the current pose.
      rotationLoop?.kill(); rotationLoop = undefined;
    }
  };
  return {
    setPlayer(open, immediate = false) {
      playerOpen = open;
      measureRecordSlot();
      pointerTween?.kill(); intro?.kill(); spinTween?.kill(); turn?.kill();
      if (immediate || reduced) { transition.value = open ? 1 : 0; pose(); render(); }
      else turn = gsap.to(transition, { value: open ? 1 : 0, duration: 1.15, ease: "power3.inOut", onUpdate: () => { pose(); render(); } });
      syncRotation();
    },
    setPlaying(next) { playing = next; syncRotation(); },
    spin() {
      if (disposed || !active || capture || playerOpen || spinTween?.isActive()) return;
      rotationLoop?.kill(); rotationLoop = undefined;
      intro?.kill();
      intro = null;
      spinTween = gsap.to(record.rotation, {
        z: record.rotation.z - Math.PI * 2,
        duration: 1.35,
        ease: "power3.out",
        onUpdate: render,
        // Remove whole turns without changing the label's visible orientation.
        onComplete: () => { record.rotation.z %= Math.PI * 2; render(); },
      });
    },
    setActive(next) {
      if (active === next) return;
      active = next;
      if (next) { intro?.resume(); spinTween?.resume(); turn?.resume(); render(); }
      else { intro?.pause(); spinTween?.pause(); turn?.pause(); pointerTween?.kill(); }
      syncRotation();
    },
    dispose() {
      disposed = true;
      intro?.kill(); spinTween?.kill(); pointerTween?.kill(); turn?.kill(); rotationLoop?.kill(); observer.disconnect();
      hero.removeEventListener("pointermove", pointer as EventListener);
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          (Array.isArray(node.material) ? node.material : [node.material]).forEach(material => material.dispose());
        }
      });
      ownedTextures.forEach(texture => texture.dispose());
      exported?.remove(); key.shadow.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
