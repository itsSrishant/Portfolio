import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

const Frame = ({ project, index, scrollData }: { project: Project; index: number; scrollData: { progress: number } }) => {
  // Determine image based on slug
  const src = project.slug === 'voice-ai-platform' ? '/images/ai-voice.png' : '/images/seo-optimiz.png';
  const texture = useTexture(src);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const borderMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  const isLeft = index % 2 === 0;
  // Space cards out by 40 units
  const zPos = -(index * 40) - 30;
  const xPos = isLeft ? -14 : 14;
  const rotY = isLeft ? Math.PI / 4 : -Math.PI / 4; // 45 degrees

  // Total Z to scroll is total length + some buffer
  const maxZ = 6 * 40 + 20;

  useFrame(({ camera, pointer, clock }) => {
    if (!groupRef.current || !materialRef.current || !borderMaterialRef.current) return;
    
    // 1. Smoothly animate camera Z based on scrollData progress
    const targetCameraZ = -(scrollData.progress * maxZ);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 0.1);

    // 2. Head Bobbing (simulate footsteps as you walk)
    // Only bob when moving (when targetZ is different from currentZ)
    const isMoving = Math.abs(camera.position.z - targetCameraZ) > 0.1;
    if (isMoving) {
      const bobY = Math.sin(clock.elapsedTime * 8) * 0.4; // Up and down
      const bobZRot = Math.sin(clock.elapsedTime * 4) * 0.02; // Side to side sway
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, bobY, 0.1);
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, bobZRot, 0.1);
    } else {
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.05);
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, 0, 0.05);
    }

    // 3. Mouse Look (Look around with the mouse)
    const targetLookX = -(pointer.x * 0.15); // Look left/right
    const targetLookY = (pointer.y * 0.15); // Look up/down
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetLookX, 0.1);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetLookY, 0.1);

    const dist = camera.position.z - zPos;

    if (dist > 20) {
      // Resting on the wall
      groupRef.current.position.set(xPos, 0, zPos);
      groupRef.current.rotation.set(0, rotY, 0);
      materialRef.current.opacity = 0.1;
      borderMaterialRef.current.opacity = 0.2;
    } else if (dist <= 20 && dist > 10) {
      // Pulling off the wall
      const t = 1 - (dist - 10) / 10; // 0 to 1
      // Use easeInOut for smooth takeoff and landing
      const easeT = t * t * (3 - 2 * t);
      
      groupRef.current.position.x = THREE.MathUtils.lerp(xPos, 0, easeT);
      // Bring frame right in front of camera
      const targetFrameZ = camera.position.z - 12;
      groupRef.current.position.z = THREE.MathUtils.lerp(zPos, targetFrameZ, easeT);
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(rotY, 0, easeT);
      
      materialRef.current.opacity = THREE.MathUtils.lerp(0.1, 1, easeT);
      borderMaterialRef.current.opacity = THREE.MathUtils.lerp(0.2, 1, easeT);
    } else if (dist <= 10 && dist > -5) {
      // Fully centered, user reading
      groupRef.current.position.set(0, 0, camera.position.z - 12);
      groupRef.current.rotation.set(0, 0, 0);
      materialRef.current.opacity = 1;
      borderMaterialRef.current.opacity = 1;
    } else {
      // Pushing away into the void
      const t = Math.min((dist + 5) / -10, 1); // 0 to 1 as it goes past
      groupRef.current.position.set(0, t * 10, (camera.position.z - 12) - (t * 5));
      materialRef.current.opacity = THREE.MathUtils.lerp(1, 0, t);
      borderMaterialRef.current.opacity = THREE.MathUtils.lerp(1, 0, t);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Golden Border */}
      <mesh 
        position={[0, 0, -0.1]}
        onClick={() => window.location.href = `/work/${project.slug}`}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <boxGeometry args={[16.5, 9.5, 0.2]} />
        <meshStandardMaterial 
          ref={borderMaterialRef}
          color="#FFA032" 
          metalness={0.8} 
          roughness={0.2} 
          transparent 
          opacity={0.2} 
        />
      </mesh>
      
      {/* Image Plane */}
      <mesh
        onClick={() => window.location.href = `/work/${project.slug}`}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <planeGeometry args={[16, 9]} />
        <meshStandardMaterial 
          ref={materialRef}
          map={texture} 
          transparent 
          opacity={0.1}
          emissive="#FFA032"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Wall Sconce PointLight - Steady glow instead of flickering */}
      <pointLight 
        position={[0, 0, 5]} 
        color="#FFA032" 
        intensity={2} 
        distance={30} 
      />
    </group>
  );
};

export default function ThreeHallwayGallery({ projects }: { projects: readonly Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  
  // Ref object to hold GSAP animation state without re-rendering React
  const scrollData = useRef({ progress: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Animate background image zoom
      gsap.to(bgRef.current, {
        scale: 2.5,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${projects.length * 2000}`,
          pin: true,
          scrub: 1,
        }
      });

      // Animate scroll progress
      gsap.to(scrollData.current, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${projects.length * 2000}`,
          scrub: 1,
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [projects.length]);

  return (
    <div ref={containerRef} className="w-full h-screen bg-[#020202] overflow-hidden relative z-10 -mx-4 md:-mx-12 px-4 md:px-12">
      
      {/* AI Generated Haunted Hallway Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-50 pointer-events-none">
        <img 
          ref={bgRef}
          src="/images/seo-optimiz/haunted_hallway.png" 
          alt="Haunted Hallway" 
          className="w-full h-full object-cover origin-center"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020202_100%)]"></div>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 0], fov: 50 }}>
          <ambientLight intensity={0.5} />
          
          {/* Haunted Dust Particles */}
          <Sparkles count={800} scale={100} size={4} speed={0.2} opacity={0.3} color="#FFA032" position={[0, 0, -50]} />

          <Suspense fallback={null}>
            {projects.map((proj, idx) => (
              <Frame key={proj.slug} project={proj} index={idx} scrollData={scrollData.current} />
            ))}
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none z-40">
        <span className="text-[#FFA032] text-[0.65rem] md:text-sm mono tracking-[0.2em] uppercase font-bold">Walk the Hallway</span>
        <p className="text-[#FFA032]/60 text-xs mt-2 max-w-[200px] md:max-w-none mx-auto">Scroll to walk forward. Click a frame to enter the project.</p>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#FFA032] to-transparent mx-auto mt-4"></div>
      </div>
    </div>
  );
}
