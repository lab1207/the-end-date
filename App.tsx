
import React, { useState, useEffect, useCallback } from 'react';
import { DateConfig, TimeRemaining } from './types';
import { calculateRemaining } from './utils/timeCalculations';
import WatchFace from './components/WatchFace';

/**
 * CONFIGURATION: CHANGE THE END DATE HERE
 * Format: 'YYYY-MM-DD'
 * 47 years old on 👉 31-12-2049 , making month 12=Dec so better math
 */
const TARGET_END_DATE = '2026-02-13'; 

const App: React.FC = () => {
  // Uses the configuration constant defined above
  const [config] = useState<DateConfig>({
    endDate: TARGET_END_DATE
  });
  
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  const updateTimer = useCallback(() => {
    // Automatically captures 'Now' from the system
    setRemaining(calculateRemaining(config, new Date()));
  }, [config]);

  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-rose-500/30 font-sans overflow-hidden">
      
      <div className="w-full max-w-lg flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000 relative">
        <header className="absolute -top-16 left-0 right-0 flex justify-between items-center px-4 z-10">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600"></div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600"></div>
        </header>

        <div className="w-full relative">
           {remaining && <WatchFace remaining={remaining} config={config} />}
        </div>

        <div className="mt-8 text-center space-y-1">
           <div className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em]">Learn Full Stack Web Dev MERN</div>
           <div className="text-zinc-400 font-bold mono text-sm opacity-50">
             {new Date(config.endDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
           </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-rose-500/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
    </div>
  );
};

export default App;
