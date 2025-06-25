'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';

export function TypingEffect({ text }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <h1
      ref={ref}
      className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white "
    >
      {text.split('').map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.05, delay: index * 0.06 }}
        >
          {letter}
        </motion.span>
      ))}
    </h1>
  );
}
