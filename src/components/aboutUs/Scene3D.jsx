import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-orange-200/80 text-sm font-mono">Chargement de la scène 3D...</p>
      </div>
    </Html>
  );
}

function Model({ url, animationsEnabled, onCamerasLoaded, onCamerasRefReady }) {
  const { scene, animations } = useGLTF(url);
  const mixerRef = useRef(null);
  const camerasRef = useRef({});
  const hasInitialized = useRef(false);
  const { camera } = useThree();

  useEffect(() => {
    if (hasInitialized.current) return;

    scene.updateMatrixWorld(true);
    
    if (animations && animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene);
      animations.forEach((animationClip) => {
        const action = mixerRef.current.clipAction(animationClip);
        action.setLoop(THREE.LoopRepeat);
        action.clampWhenFinished = false;
      });
    }
    
    const cameras = {};
    scene.traverse((object) => {
      if (object instanceof THREE.PerspectiveCamera || object instanceof THREE.OrthographicCamera) {
        object.updateMatrixWorld(true);
        const matrix = object.matrixWorld.clone();
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        matrix.decompose(position, quaternion, scale);
        
        cameras[object.name] = {
          position: position.clone(),
          quaternion: quaternion.clone(),
          rotation: new THREE.Euler().setFromQuaternion(quaternion),
          fov: object.fov || 50,
          isPerspective: object instanceof THREE.PerspectiveCamera,
        };
      }
    });

    camerasRef.current = cameras;
    
    if (onCamerasRefReady) {
      onCamerasRefReady(camerasRef);
    }

    if (onCamerasLoaded) {
      const cameraNames = Object.keys(cameras);
      const cameraOrder = ['Vue d\'ensemble', 'Professeur', 'élève1', 'élève2'];
      const sortedCameras = cameraNames.sort((firstCameraName, secondCameraName) => {
        const indexA = cameraOrder.indexOf(firstCameraName);
        const indexB = cameraOrder.indexOf(secondCameraName);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return firstCameraName.localeCompare(secondCameraName);
      });
      onCamerasLoaded(sortedCameras);
      
      if (sortedCameras.length > 0) {
        const firstCameraName = sortedCameras[0];
        const firstCamera = cameras[firstCameraName];
        
        if (firstCamera) {
          camera.position.copy(firstCamera.position);
          if (firstCamera.quaternion) {
            camera.quaternion.copy(firstCamera.quaternion);
          } else if (firstCamera.rotation) {
            camera.rotation.copy(firstCamera.rotation);
          }
          
          if (firstCamera.isPerspective && camera instanceof THREE.PerspectiveCamera) {
            camera.fov = firstCamera.fov;
          }
          
          camera.updateProjectionMatrix();
        }
      }
    }

    if (Object.keys(cameras).length === 0) {
      const box = new THREE.Box3().setFromObject(scene);
      if (!box.isEmpty()) {
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 1);
        const distance = maxDim * 2.5;
        
        camera.position.set(
          center.x + distance * 0.7,
          center.y + distance * 0.6,
          center.z + distance * 0.7
        );
        camera.lookAt(center);
        camera.updateProjectionMatrix();
      }
    }

    hasInitialized.current = true;

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current.uncacheRoot(mixerRef.current.getRoot());
        mixerRef.current = null;
      }
      hasInitialized.current = false;
    };
  }, [scene, animations, camera, onCamerasLoaded, onCamerasRefReady]);

  useEffect(() => {
    if (!mixerRef.current || !animations || animations.length === 0) {
      return;
    }

    animations.forEach((animationClip) => {
      const action = mixerRef.current.existingAction(animationClip) || mixerRef.current.clipAction(animationClip);
      if (!action) {
        return;
      }

      if (animationsEnabled) {
        if (!action.isRunning()) {
          action.reset();
          action.setLoop(THREE.LoopRepeat);
          action.setEffectiveTimeScale(1);
          action.enabled = true;
          action.play();
        } else {
          action.paused = false;
        }
      } else {
        action.paused = true;
      }
    });
  }, [animationsEnabled, animations]);

  useFrame((frameState, timeDelta) => {
    if (mixerRef.current) {
      mixerRef.current.update(Math.min(timeDelta, 0.1));
    }
  });

  useEffect(() => {
    scene.traverse((sceneObject) => {
      if (sceneObject.isMesh) {
        if (sceneObject.geometry) {
          sceneObject.geometry.computeBoundingSphere();
        }
        sceneObject.visible = true;
        sceneObject.frustumCulled = true;
        
        if (sceneObject.material) {
          const materials = Array.isArray(sceneObject.material) ? sceneObject.material : [sceneObject.material];
          materials.forEach((material) => {
            material.visible = true;
            if (material.map) {
              material.map.generateMipmaps = true;
            }
          });
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

function CameraController({ cameraName, camerasRef }) {
  const { camera } = useThree();

  useEffect(() => {
    if (cameraName && camerasRef.current && camerasRef.current[cameraName]) {
      const targetCamera = camerasRef.current[cameraName];
      
      camera.position.copy(targetCamera.position);
      if (targetCamera.quaternion) {
        camera.quaternion.copy(targetCamera.quaternion);
      }
      if (targetCamera.isPerspective && camera instanceof THREE.PerspectiveCamera) {
        camera.fov = targetCamera.fov;
      }
      camera.updateProjectionMatrix();
    }
  }, [cameraName, camerasRef, camera]);

  return null;
}

export default function Scene3D({ modelUrl, height = '600px' }) {
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [activeCameraName, setActiveCameraName] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const camerasRef = useRef({});
  const containerRef = useRef(null);

  const handleCamerasLoaded = useCallback((cameraNames) => {
    setAvailableCameras(cameraNames);
    if (cameraNames.length > 0) {
      const firstCamera = cameraNames[0];
      setSelectedCamera(firstCamera);
      setActiveCameraName(firstCamera);
    }
  }, []);

  const handleCamerasRefReady = useCallback((camerasReference) => {
    camerasRef.current = camerasReference.current;
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          window.dispatchEvent(new Event('resize'));
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
      style={{ 
        height: isFullscreen ? '100vh' : height,
        width: isFullscreen ? '100vw' : '100%'
      }}
    >
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg border border-orange-200/30">
          <div className={`w-2 h-2 rounded-full ${animationsEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-orange-200/80 text-xs font-mono uppercase tracking-wider">
            {animationsEnabled ? 'Animations ON' : 'Animations OFF'}
          </span>
        </div>

        <button
          onClick={() => setAnimationsEnabled(!animationsEnabled)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          {animationsEnabled ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={toggleFullscreen}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          {isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
        </button>

        {availableCameras.length > 0 && (
          <div className="bg-black/60 backdrop-blur-sm rounded-lg border border-orange-200/30 p-2">
            <label 
              htmlFor="camera-select"
              className="text-orange-200/80 text-xs font-mono uppercase tracking-wider block mb-2"
            >
              Caméras
            </label>
            <select
              id="camera-select"
              name="camera-select"
              value={selectedCamera || ''}
              onChange={(changeEvent) => {
                setSelectedCamera(changeEvent.target.value);
                setActiveCameraName(changeEvent.target.value);
              }}
              className="w-full px-3 py-2 bg-black/80 text-white rounded border border-orange-200/30 text-sm focus:outline-none focus:border-orange-500"
            >
              {availableCameras.map((cameraName) => (
                <option key={cameraName} value={cameraName}>
                  {cameraName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 z-10 px-5 py-3.5 bg-black rounded-lg border-2 border-orange-500 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        <p className="text-white font-bold text-sm tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,1), 0 0 8px rgba(251,146,60,0.5)' }}>
          Cliquez et glissez pour tourner • Molette pour zoomer • Clic droit pour déplacer
        </p>
      </div>

      <Canvas
        shadows={false}
        dpr={isFullscreen ? Math.min(window.devicePixelRatio || 1, 1.2) : Math.min(window.devicePixelRatio || 1, 1.5)}
        frameloop="always"
        performance={{ min: isFullscreen ? 0.7 : 0.8 }}
        gl={{ 
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
        camera={{ position: [0, 1.2, 5], fov: 50 }}
        onCreated={({ gl: webGLRenderer }) => {
          webGLRenderer.setClearColor('#0f0f0f', 1);
          webGLRenderer.toneMapping = THREE.ACESFilmicToneMapping;
          webGLRenderer.toneMappingExposure = 0.8;
          webGLRenderer.sortObjects = false;
        }}
        style={{ background: '#0f0f0f', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, 10, -5]} intensity={1.2} />
        <pointLight position={[0, 5, 0]} intensity={1.2} />
        <hemisphereLight intensity={0.6} />

        <Suspense fallback={<Loader />}>
          <Model
            url={modelUrl}
            animationsEnabled={animationsEnabled}
            onCamerasLoaded={handleCamerasLoaded}
            onCamerasRefReady={handleCamerasRefReady}
          />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.5}
          maxDistance={50}
          enableDamping={true}
          dampingFactor={0.08}
          rotateSpeed={0.5}
          panSpeed={0.5}
          zoomSpeed={0.6}
          autoRotate={false}
        />

        {activeCameraName && camerasRef.current && (
          <CameraController
            cameraName={activeCameraName}
            camerasRef={camerasRef}
          />
        )}
      </Canvas>
    </div>
  );
}

if (typeof window !== 'undefined') {
  useGLTF.preload = (url) => {
    const loader = new THREE.GLTFLoader();
    loader.load(url);
  };
}
