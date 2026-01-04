'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { IconDeviceGamepad2 } from '@tabler/icons-react';
import { MokuAsset } from '@/lib/types';

export const ThreeDCard = ({ asset }: { asset: MokuAsset }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x);
  const mouseY = useSpring(y);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full h-full flex items-center justify-center p-4"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-64 h-80 rounded-xl shadow-xl transition-shadow duration-200 cursor-pointer"
      >
        {/* Card Background */}
        <div
          className="absolute inset-0 rounded-xl border-4 border-white/10 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${asset.color} 0%, #1a1a1a 100%)`,
          }}
        >
          {/* Mock Image Content */}
          <div className="flex flex-col h-full items-center justify-center text-white/90 p-4 text-center">
            <span className="text-4xl font-black uppercase tracking-tighter opacity-20 select-none absolute top-10 transform -rotate-12">
              {asset.type}
            </span>
            <div className="z-10 bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <IconDeviceGamepad2 className="w-16 h-16 mx-auto mb-2 opacity-80" />
              <h3 className="font-bold text-lg leading-tight">{asset.name}</h3>
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 55%, transparent 60%)',
            transform: 'translateZ(1px)',
          }}
        />
      </motion.div>
    </div>
  );
};
