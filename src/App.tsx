import { useEffect, useRef } from "react";
import * as THREE from "three";
import GUI from "lil-gui";

import "./App.css";

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// UIデバッグ
const gui = new GUI();

// シーン
const scene = new THREE.Scene();

// カメラを作成
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 6);
scene.add(camera);

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// マテリアル
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true,
});

gui.addColor(material, "color");
gui.add(material, "metalness", 0, 1, 0.001);
gui.add(material, "roughness", 0, 1, 0.001);

// メッシュ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

// 回転用に配置する
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);

const meshes = [mesh1, mesh2, mesh3, mesh4];

scene.add(...meshes);

/**
 * パーティクルを追加
 */

// ジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
const particlesPositionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  particlesPositionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(particlesPositionArray, 3)
);

// マテリアル
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: "#ffffff",
});

// メッシュ化
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// ライト
const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
directionalLight.position.set(0.5, 1, 0);

scene.add(directionalLight);

// クロック
const clock = new THREE.Clock();

let speed = 0;
let rotation = 0;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/** アプリケーションのルートコンポーネント */
const App = () => {
  const refDiv = useRef<HTMLDivElement>(null);

  const handleonBrowserResize = () => {
    // カメラの修正
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // レンダラーのリサイズ
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    return;
  };

  const handleOnWheel = (event: WheelEvent) => {
    speed += event.deltaY * 0.0002;
  };

  useEffect(() => {
    window.addEventListener("resize", handleonBrowserResize);

    // ホイールを実装
    window.addEventListener("wheel", handleOnWheel);

    refDiv.current?.appendChild(renderer.domElement);

    const updateRender = () => {
      const deltaTime = clock.getDelta();

      // meshを回転させる
      meshes.forEach((mesh) => {
        mesh.rotation.x += 0.1 * deltaTime;
        mesh.rotation.y += 0.12 * deltaTime;
      });

      // レンダリング
      renderer.render(scene, camera);

      requestAnimationFrame(updateRender);
    };

    const rotateByWheel = () => {
      rotation += speed;
      speed *= 0.93;

      // ジオメトリ全体を回転
      // NOTE: 計算式の図解は次のファイルを参照
      // threejs-demo-site1/docs/sec12-98.drawio.png

      const [xBase, zBase] = [2, -3];
      const radius = 3.8;

      mesh1.position.x = xBase + radius * Math.cos(rotation);
      mesh1.position.z = zBase + radius * Math.sin(rotation);

      mesh2.position.x = xBase + radius * Math.cos(rotation + Math.PI / 2);
      mesh2.position.z = zBase + radius * Math.sin(rotation + Math.PI / 2);

      mesh3.position.x = xBase + radius * Math.cos(rotation + Math.PI);
      mesh3.position.z = zBase + radius * Math.sin(rotation + Math.PI);

      mesh4.position.x =
        xBase + radius * Math.cos(rotation + (Math.PI * 3) / 2);
      mesh4.position.z =
        zBase + radius * Math.sin(rotation + (Math.PI * 3) / 2);

      requestAnimationFrame(rotateByWheel);
    };

    updateRender();
    rotateByWheel();

    return () => {
      refDiv.current?.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleonBrowserResize);
      window.removeEventListener("wheel", handleOnWheel);
    };
  }, []);

  return (
    <div className="App">
      <div className="webgl" ref={refDiv}></div>

      <main className="section">
        <div className="content">
          <h1>未到達の次元へ</h1>

          <p>
            ありふれたエンジニアで終わらせない。
            <br />
            人々を感動させる技術を身に着ける。
            <br />
            あなたが求めるスキルがここにある。
          </p>

          <button>私の作品へ</button>
        </div>
      </main>
    </div>
  );
};

export default App;
