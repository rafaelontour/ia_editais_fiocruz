"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const animationFrameRef = useRef<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = (event: any) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const halfWidth = event.target.offsetWidth / 2;
      x.set(event.nativeEvent.offsetX - halfWidth);
    });
  };

  const handleMouseEnter = (index: number, itemIndex: number) => {
    setHoveredIndex(index);
    const ref = itemRefs.current[itemIndex];
    if (ref) {
      const rect = ref.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 80, // Ajuste para posição acima
        left: rect.left + rect.width / 2,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltipPosition(null);
  };

  return (
    <div className="flex gap-2">
      {items.map((item, idx) => (
        <div
          ref={(el) => { itemRefs.current[idx] = el; }}
          className="group relative -mr-4"
          key={item.name}
          onMouseEnter={() => handleMouseEnter(item.id, idx)}
          onMouseLeave={handleMouseLeave}
        >
          <img
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className="relative !m-0 h-9 w-9 rounded-full border-2 border-zinc-200 object-cover object-top p-0! transition duration-500 group-hover:z-30 group-hover:scale-105"
          />
        </div>
      ))}
      {createPortal(
        <AnimatePresence>
          {hoveredIndex !== null && tooltipPosition && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 20,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 10,
                },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              style={{
                translateX: translateX,
                rotate: rotate,
                position: "fixed",
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                zIndex: 1000,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
              className="flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
            >
              <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-linear-to-r from-transparent via-emerald-500 to-transparent" />
              <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-linear-to-r from-transparent via-sky-500 to-transparent" />
              <div className="relative z-30 text-md font-bold text-white">
                {items.find(item => item.id === hoveredIndex)?.name}
              </div>
              <div className="text-xs text-white">{items.find(item => item.id === hoveredIndex)?.designation}</div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
