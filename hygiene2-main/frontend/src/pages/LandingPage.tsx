import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Zap } from 'lucide-react'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#020617] text-white">
            {/* Background pattern */}
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            
            <div className="z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                >
                    <ShieldCheck className="h-10 w-10" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-5xl md:text-7xl font-black tracking-tighter uppercase"
                >
                    AI Hygiene <span className="text-indigo-400">Detector</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="mt-6 max-w-2xl text-lg md:text-xl text-zinc-400"
                >
                    Real-time compliance monitoring powered by advanced computer vision. 
                    Ensuring safety and standards in food preparation environments.
                </motion.p>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        onClick={() => navigate('/login')}
                        className="rounded-full bg-white px-8 py-4 text-sm md:text-base font-bold tracking-wide text-black shadow-xl hover:bg-zinc-200 transition-colors"
                    >
                        Access Dashboard
                    </motion.button>
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-white/10 pt-10"
                >
                    <div className="flex flex-col items-center gap-2">
                        <Zap className="h-6 w-6 text-yellow-400" />
                        <h3 className="font-semibold">Real-time</h3>
                        <p className="text-sm text-zinc-500">Instant detection & alerts</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Activity className="h-6 w-6 text-emerald-400" />
                        <h3 className="font-semibold">Analytics</h3>
                        <p className="text-sm text-zinc-500">Deep performance insights</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-indigo-400" />
                        <h3 className="font-semibold">Compliance</h3>
                        <p className="text-sm text-zinc-500">Automated safety auditing</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
