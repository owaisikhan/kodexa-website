"use client";

import { motion } from "motion/react";

// The one entrance animation used everywhere. Keeping it in a single component
// is what stops twelve sections each inventing their own timing.
//
// It renders visible by default and animates on scroll, so a JS failure leaves
// readable content rather than a blank page.

const directions = {
  up: { y: 26, x: 0 },
  down: { y: -26, x: 0 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  as = "div",
  amount = 0.35,
}) {
  const offset = directions[direction] ?? directions.up;
  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Tag>
  );
}
