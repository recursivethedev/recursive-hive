import { useRef, useState, useEffect } from "react";
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, useGLTF, useTexture, Html } from "@react-three/drei";

const prizes = [[Math.PI / 21, Math.PI / 4, Math.PI / 2.22, Math.PI / 1.65, Math.PI / 1.23, Math.PI / 0.99, Math.PI / 0.82, Math.PI / 0.705, Math.PI / 0.55],
                [Math.PI / 2.85, Math.PI / 0.895, Math.PI / 0.66, Math.PI / 0.582],
                [Math.PI / 0.944],
                [Math.PI / 0.53],
                [Math.PI / 1.89],
                [Math.PI / 6.5, Math.PI / 0.76],
                [Math.PI / 1.41, Math.PI / 1.1, Math.PI / 0.617, Math.PI / 0.514]
               ];

export default function Model(props) {
  const [result, setResult] = useState(null);

  const spin = useRef(false);
  const target = useRef(null);
  const wheel = useRef();

  const { nodes, materials } = useGLTF("/wheel/scene.glb");

  if (props.receivedPrize !== null && result === null) {
    setResult(props.receivedPrize);
  }

  if (result !== null && target.current === null) {
    target.current = prizes[result][Math.floor(Math.random() * prizes[result].length)] + Math.PI * 2;
  }

  useFrame(() => {
    if (props.spin) {
      if(result !== null && parseInt(wheel.current.rotation.z % (Math.PI * 2)) === 0) {
        wheel.current.rotation.z %= Math.PI * 2;
        props.setSpin(false);
      }
      else {
        wheel.current.rotation.z += Math.PI / 100;
      }
    }
    else if (result !== null) {
      if (wheel.current.rotation.z < target.current) {
        wheel.current.rotation.z += Math.min(Math.PI / 100, Math.max((target.current - wheel.current.rotation.z) / 100, Math.PI / 2500));
        if (target.current - wheel.current.rotation.z <= Math.PI / 10000) {
          target.current = null;
          props.setReceivedPrize(null);
          if (result === 0) {
            props.setPrizeStatus("50");
          }
          else if (result === 1) {
            props.setPrizeStatus("150");
          }
          else if (result === 6) {
            props.setPrizeStatus("500");
          }
          else {
            props.setPrizeStatus("update");
          }
          setResult(null);
        }
      }
    }
  });

  const logoTexture = useTexture({
    map: '/wheel/Logo_Hive.png'
  });

  useEffect(() => {
    props.setSceneLoaded(true);
  }, []);

  return (
    <group {...props} dispose={null}>
      <mesh position={[-8, 8, -2]}>
        <planeGeometry args={[10.6, 2]} />
        <meshBasicMaterial {...logoTexture} transparent />
      </mesh>

      <Html transform position={[7, 8, -2]}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#fff',
          textAlign: 'center',
          fontFamily: 'Oswald, sans-serif'
        }}>
          <span style={{ background: 'rgba(255, 255, 255, 0.5)', width: '150px', padding: '10px', borderRadius: '10px 10px 0 0' }}>House Edge = 4%</span>
          <span style={{ background: 'rgba(255, 255, 255, 0.25)', padding: '10px', width: '150px', borderRadius: '0 0 10px 10px' }}>Jackpot = $500</span>
        </div>
      </Html>

      <mesh
        geometry={nodes.pasted__Plane004.geometry}
        material={materials.Roleta_hexagon}
        position={[0, 8.757, 4.399]}
      />
      <mesh
        geometry={nodes.pasted__Circle.geometry}
        material={materials.Roleta_hexagon}
        position={[0, 3.688, 0.779]}
        onClick={(e) => {
          e.stopPropagation();
          if (!props.spin && result === null) {
            props.handleSpin();
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!props.spin && result === null) {
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      />
      <mesh
        geometry={nodes.pasted__Plane001.geometry}
        material={materials.Roleta_hexagon}
        position={[0, 3.688, -0.353]}
        ref={wheel}
        onClick={(e) => {
          e.stopPropagation();

          if (props.isPlaying === 'initial') {
            props.audioContext.current.resume();
            props.soundtrackRef.current.play();
            props.setIsPlaying('playing');
          }

          if (!props.spin && result === null) {
            props.handleSpin();
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!props.spin && result === null) {
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.155, 9]}>
        <planeGeometry args={[50, 30]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={1000}
          roughness={0.9}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#010101"
          metalness={0}
          transparent
          opacity={0.5}
        />
      </mesh>
      <ambientLight intensity={0.5} />
    </group>
  );
}

useGLTF.preload("/wheel/scene.glb");
