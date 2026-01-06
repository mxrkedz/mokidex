'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image'; // Import Next.js Image component
import { RealNFT } from '@/lib/nft-types';

// Helper to assign colors based on the contract type since real data doesn't have a 'color' field
const getAssetColor = (type: string) => {
  switch (type) {
    case 'Moki':
      return '#4ade80'; // Greenish for Moki
    case 'Booster':
      return '#a78bfa'; // Purple for Booster
    default:
      return '#9ca3af'; // Grey for others
  }
};

export const ThreeDCard = ({ asset }: { asset: RealNFT }) => {
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

  const assetColor = getAssetColor(asset.contractType);

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
        className="relative w-64 h-80 rounded-xl shadow-xl transition-shadow duration-200 cursor-pointer group"
      >
        {/* Card Background */}
        <div
          className="absolute inset-0 rounded-xl border-4 border-white/10 overflow-hidden bg-card"
          style={{
            background: `linear-gradient(135deg, ${assetColor} 0%, #1a1a1a 100%)`,
          }}
        >
          {/* Real Image Content */}
          <div className="flex flex-col h-full items-center justify-between p-2 pb-4 text-white/90">
            {/* Top Label */}
            <div className="w-full flex justify-between items-start z-10 px-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-widest opacity-70 bg-black/40 px-2 py-1 rounded">
                {asset.contractType}
              </span>
              <span className="text-xs font-mono opacity-70">
                #{asset.tokenId}
              </span>
            </div>

            {/* Image Container */}
            <div className="relative w-40 h-40 my-auto z-10 transform transition-transform duration-500 group-hover:scale-110">
              {asset.image ? (
                <Image
                  src={asset.image}
                  alt={asset.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 160px"
                />
              ) : (
                <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </div>

            {/* Bottom Info */}
            <div className="z-10 bg-black/40 backdrop-blur-md w-full p-3 rounded-lg border border-white/10 text-center">
              <h3 className="font-bold text-sm leading-tight truncate px-1">
                {asset.name}
              </h3>
              <p className="text-[10px] text-white/60 mt-1 uppercase font-semibold">
                {asset.rarityLabel || 'Common'}
              </p>
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
