import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Rules = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212); // Match dark theme

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // Adjust size to container, not window
    const container = mountRef.current;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Objects: Rotating Cubes representing Code Blocks
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    
    const cube1 = new THREE.Mesh(geometry, material);
    const cube2 = new THREE.Mesh(geometry, material);
    
    cube1.position.x = -2;
    cube2.position.x = 2;
    
    scene.add(cube1);
    scene.add(cube2);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 10);
    scene.add(light);

    camera.position.z = 5;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      cube1.rotation.x += 0.01;
      cube1.rotation.y += 0.01;
      
      cube2.rotation.x -= 0.01;
      cube2.rotation.y -= 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-6">
      {/* Text Content */}
      <div className="w-1/2 p-8 overflow-y-auto">
        <h1 className="text-4xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          WHY 1v1 CODE BATTLE?
        </h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-2">⚔️ The Arena Logic</h2>
            <p>
              Traditional coding is solitary. Code Battle changes this. It forces you to think fast, optimize under pressure, and debug in real-time against a live opponent. It's not just about solving the problem; it's about solving it <strong>better</strong> and <strong>faster</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">🏆 Rules of Engagement</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Both players start with the same problem.</li>
              <li>You have <strong>15 minutes</strong> to pass all test cases.</li>
              <li>Hidden test cases determine the true winner.</li>
              <li>First to submit with 100% accuracy wins.</li>
              <li>If time runs out, the code with the most passed test cases wins.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-2">🚀 Elo Rating System</h2>
            <p>
              Just like Chess, you gain rating points (Elo) for winning and lose them for defeat. Beating a higher-ranked player yields more points. Climb from <strong>Bronze</strong> to <strong>Grandmaster</strong>.
            </p>
          </section>
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="w-1/2 bg-black/20 rounded-2xl border border-gray-800 overflow-hidden relative">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500 font-mono">
          INTERACTIVE BATTLE VISUALIZATION
        </div>
      </div>
    </div>
  );
};

export default Rules;