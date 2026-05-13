'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useMatterStore } from '@/lib/store';
import { BottomNav } from '@/components/ui/BottomNav';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { SpaceScreen } from '@/components/screens/SpaceScreen';
import { DebriefScreen } from '@/components/screens/DebriefScreen';
import { ProfileScreen } from '@/components/screens/ProfileScreen';

export default function App() {
  const { screen } = useMatterStore();

  const screenMap = {
    home: <HomeScreen />,
    space: <SpaceScreen />,
    debrief: <DebriefScreen />,
    profile: <ProfileScreen />,
  };

  return (
    <main className="relative max-w-md mx-auto min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {screenMap[screen]}
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </main>
  );
}
