import React from 'react';

const Background3D = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dynamic Mesh Gradients */}
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-gradient-to-tr from-rose-500/20 via-purple-600/15 to-transparent rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 via-sky-500/15 to-transparent rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Cyber Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating 3D Cubes using CSS 3D Transforms */}
      <div className="absolute top-24 left-[12%] opacity-60 float-slow hidden md:block">
        <div className="cube-3d">
          <div className="cube-face front"></div>
          <div className="cube-face back"></div>
          <div className="cube-face right"></div>
          <div className="cube-face left"></div>
          <div className="cube-face top"></div>
          <div className="cube-face bottom"></div>
        </div>
      </div>

      <div className="absolute bottom-32 right-[10%] opacity-40 float-medium hidden lg:block">
        <div className="cube-3d cube-3d-small">
          <div className="cube-face front"></div>
          <div className="cube-face back"></div>
          <div className="cube-face right"></div>
          <div className="cube-face left"></div>
          <div className="cube-face top"></div>
          <div className="cube-face bottom"></div>
        </div>
      </div>

      <div className="absolute top-1/3 right-[18%] opacity-30 float-fast hidden sm:block">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500/30 to-purple-500/10 border border-white/20 backdrop-blur-md rotate-45 animate-spin-slow" />
      </div>

      <div className="absolute bottom-1/4 left-[8%] opacity-35 float-slow hidden sm:block">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500/30 to-amber-500/10 border border-white/20 backdrop-blur-md rotate-12" />
      </div>
    </div>
  );
};

export default Background3D;
