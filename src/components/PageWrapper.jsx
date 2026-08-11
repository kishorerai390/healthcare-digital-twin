import React from 'react'
import { motion } from 'framer-motion'

const pageVariants = {
  initial: {
    opacity: 0,
    x: 35,
    scale: 0.99
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    x: -35,
    scale: 0.99
  }
}

const pageTransition = {
  type: 'tween',
  ease: [0.25, 1, 0.5, 1],
  duration: 0.35
}

export default function PageWrapper({ children, className = '' }){
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
