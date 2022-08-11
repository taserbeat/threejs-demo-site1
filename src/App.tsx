import { useEffect, useRef } from "react";
import * as THREE from "three";

import "./App.css";

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

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

scene.add(mesh1, mesh2, mesh3, mesh4);

// ライト
const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
directionalLight.position.set(0.5, 1, 0);

scene.add(directionalLight);

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

  useEffect(() => {
    window.addEventListener("resize", handleonBrowserResize);

    refDiv.current?.appendChild(renderer.domElement);

    const updateRender = () => {
      // レンダリング
      renderer.render(scene, camera);
      requestAnimationFrame(updateRender);
    };

    updateRender();

    return () => {
      refDiv.current?.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleonBrowserResize);
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
