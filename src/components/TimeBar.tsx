import { motion } from 'framer-motion'

interface TimerBarProps {
  duration: number
}

export default function TimerBar({ duration }: TimerBarProps) {
  return (
    <motion.div
      className="h-2 bg-slate-700 rounded-full mb-4"
      initial={{ width: '100%' }}
      animate={{ width: '0%' }}
      transition={{ duration: duration }}
    >
      <div className="h-full bg-cyan-500 rounded-full" />
    </motion.div>
  )
}