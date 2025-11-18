"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnimatedBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 12;

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404060, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff4400, 1, 100);
    pointLight.position.set(-8, 0, 0);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x0044ff, 1, 100);
    pointLight2.position.set(8, 0, 0);
    scene.add(pointLight2);

    // 🔥 ENHANCED FIRE - Left side
    const fireGroup = new THREE.Group();
    scene.add(fireGroup);

    // Main fire particles
    const fireParticles = new THREE.BufferGeometry();
    const fireCount = 500;
    const firePositions = new Float32Array(fireCount * 3);
    const fireColors = new Float32Array(fireCount * 3);
    const fireSizes = new Float32Array(fireCount);
    
    for (let i = 0; i < fireCount; i++) {
      const radius = Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      firePositions[i * 3] = Math.cos(angle) * radius - 8; // Left position
      firePositions[i * 3 + 1] = Math.random() * 6 - 3;
      firePositions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const intensity = Math.random() * 0.6 + 0.4;
      fireColors[i * 3] = intensity; // Red
      fireColors[i * 3 + 1] = intensity * 0.5; // Orange
      fireColors[i * 3 + 2] = intensity * 0.1; // Yellow tint
      
      fireSizes[i] = Math.random() * 0.3 + 0.1;
    }
    
    fireParticles.setAttribute('position', new THREE.BufferAttribute(firePositions, 3));
    fireParticles.setAttribute('color', new THREE.BufferAttribute(fireColors, 3));
    fireParticles.setAttribute('size', new THREE.BufferAttribute(fireSizes, 1));
    
    const fireMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: true
    });
    
    const fire = new THREE.Points(fireParticles, fireMaterial);
    fireGroup.add(fire);

    // Fire core glow
    const fireGlowGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const fireGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const fireGlow = new THREE.Mesh(fireGlowGeometry, fireGlowMaterial);
    fireGlow.position.set(-8, 0, 0);
    scene.add(fireGlow);

    // ❄️ ENHANCED ICE/SNOW - Right side
    const snowGroup = new THREE.Group();
    scene.add(snowGroup);

    const snowParticles = new THREE.BufferGeometry();
    const snowCount = 800;
    const snowPositions = new Float32Array(snowCount * 3);
    const snowColors = new Float32Array(snowCount * 3);
    const snowSpeeds = new Float32Array(snowCount);
    
    for (let i = 0; i < snowCount; i++) {
      snowPositions[i * 3] = Math.random() * 10 + 6; // Right position
      snowPositions[i * 3 + 1] = Math.random() * 15 - 5;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      const blueTint = Math.random() * 0.3 + 0.7;
      snowColors[i * 3] = blueTint;
      snowColors[i * 3 + 1] = blueTint;
      snowColors[i * 3 + 2] = 1.0;
      
      snowSpeeds[i] = Math.random() * 0.03 + 0.01;
    }
    
    snowParticles.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    snowParticles.setAttribute('color', new THREE.BufferAttribute(snowColors, 3));
    snowParticles.setAttribute('speed', new THREE.BufferAttribute(snowSpeeds, 1));
    
    const snowMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });
    
    const snow = new THREE.Points(snowParticles, snowMaterial);
    snowGroup.add(snow);

    // Ice crystal
    const iceGeometry = new THREE.OctahedronGeometry(2, 0);
    const iceMaterial = new THREE.MeshPhongMaterial({
      color: 0xaaccff,
      transparent: true,
      opacity: 0.6,
      shininess: 100,
      specular: 0xffffff
    });
    const iceCrystal = new THREE.Mesh(iceGeometry, iceMaterial);
    iceCrystal.position.set(8, 0, 0);
    scene.add(iceCrystal);

    // 💧 ENHANCED WATER - Bottom with flowing effect
    const waterGeometry = new THREE.PlaneGeometry(25, 6, 50, 25);
    const waterMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x0066ff) },
        color2: { value: new THREE.Color(0x00aaff) },
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          vec3 pos = position;
          // Complex wave pattern
          pos.y += sin(pos.x * 2.0 + time * 2.0) * 0.4 
                 + cos(pos.z * 1.5 + time * 1.7) * 0.3
                 + sin(pos.x * 3.0 + pos.z * 2.0 + time * 3.0) * 0.2;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vec2 movingUv = vec2(vUv.x - time * 0.3, vUv.y + sin(vUv.x * 5.0 + time) * 0.1);
          float gradient = smoothstep(0.0, 1.0, vUv.y);
          vec3 color = mix(color1, color2, gradient);
          
          // Ripple effect
          float ripple = sin(movingUv.x * 15.0 + time * 4.0) * 0.1 
                       + cos(movingUv.y * 12.0 + time * 3.0) * 0.1;
          
          // Foam pattern
          float foam = sin(movingUv.x * 20.0 + time * 5.0) * 0.5 + 0.5;
          foam *= smoothstep(0.4, 0.6, vUv.y);
          
          color = mix(color, vec3(1.0), foam * 0.3);
          gl_FragColor = vec4(color, 0.8 - ripple * 0.3);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
    
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -5, 0);
    scene.add(water);

    // ✨ FLOATING CARDS ELEMENTS - Card-like particles floating around
    const cardParticles = new THREE.BufferGeometry();
    const cardCount = 100;
    const cardPositions = new Float32Array(cardCount * 3);
    const cardRotations = new Float32Array(cardCount * 3);
    
    for (let i = 0; i < cardCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 8 + 2;
      cardPositions[i * 3] = Math.cos(angle) * radius;
      cardPositions[i * 3 + 1] = Math.random() * 8 - 4;
      cardPositions[i * 3 + 2] = Math.sin(angle) * radius;
      
      cardRotations[i * 3] = Math.random() * Math.PI;
      cardRotations[i * 3 + 1] = Math.random() * Math.PI;
      cardRotations[i * 3 + 2] = Math.random() * Math.PI;
    }
    
    cardParticles.setAttribute('position', new THREE.BufferAttribute(cardPositions, 3));
    cardParticles.setAttribute('rotation', new THREE.BufferAttribute(cardRotations, 3));
    
    const cardMaterial = new THREE.PointsMaterial({
      color: 0x8844ff,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const cards = new THREE.Points(cardParticles, cardMaterial);
    scene.add(cards);

    // Animation loop
    let time = 0;
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta;

      // Animate fire with turbulence
      const firePos = fireParticles.attributes.position.array as Float32Array;
      for (let i = 0; i < fireCount; i++) {
        const index = i * 3;
        firePos[index + 1] += 0.02 + Math.sin(time * 5 + i) * 0.01; // Rising with turbulence
        firePos[index] += Math.sin(time * 3 + i) * 0.01; // Side movement
        
        if (firePos[index + 1] > 6) {
          firePos[index + 1] = -4;
          firePos[index] = (Math.random() - 0.5) * 3 - 8;
          firePos[index + 2] = (Math.random() - 0.5) * 3;
        }
      }
      fireParticles.attributes.position.needsUpdate = true;

      // Fire glow pulsation
      fireGlow.scale.setScalar(1 + Math.sin(time * 2) * 0.2);

      // Update water shader
      waterMaterial.uniforms.time.value = time;

      // Animate snow with swirling
      const snowPos = snowParticles.attributes.position.array as Float32Array;
      const snowSpeed = snowParticles.attributes.speed.array as Float32Array;
      for (let i = 0; i < snowCount; i++) {
        const index = i * 3;
        snowPos[index + 1] -= snowSpeed[i];
        snowPos[index] += Math.sin(time * 2 + i) * 0.01; // Swirling effect
        
        if (snowPos[index + 1] < -7) {
          snowPos[index + 1] = 7;
          snowPos[index] = Math.random() * 10 + 6;
          snowPos[index + 2] = (Math.random() - 0.5) * 10;
        }
      }
      snowParticles.attributes.position.needsUpdate = true;

      // Rotate ice crystal
      iceCrystal.rotation.x = time * 0.5;
      iceCrystal.rotation.y = time * 0.7;
      iceCrystal.scale.setScalar(1 + Math.sin(time * 1.5) * 0.1);

      // Animate card particles
      const cardPos = cardParticles.attributes.position.array as Float32Array;
      const cardRot = cardParticles.attributes.rotation.array as Float32Array;
      for (let i = 0; i < cardCount; i++) {
        const posIndex = i * 3;
        const rotIndex = i * 3;
        
        // Orbital movement
        const angle = time * 0.2 + i * 0.1;
        const radius = Math.sqrt(cardPos[posIndex] ** 2 + cardPos[posIndex + 2] ** 2);
        cardPos[posIndex] = Math.cos(angle) * radius;
        cardPos[posIndex + 2] = Math.sin(angle) * radius;
        
        // Floating up and down
        cardPos[posIndex + 1] += Math.sin(time * 0.5 + i) * 0.005;
        
        // Rotation
        cardRot[rotIndex] += 0.01;
        cardRot[rotIndex + 1] += 0.008;
      }
      cardParticles.attributes.position.needsUpdate = true;

      // Group rotations
      fireGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
      snowGroup.rotation.y = Math.sin(time * 0.2) * 0.1;

      renderer.render(scene, camera);
    };
    
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}
    />
  );
};

export default AnimatedBackground;