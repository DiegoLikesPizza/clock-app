"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface AtomicTimeState {
  time: Date;
  isSynced: boolean;
  offset: number; // Offset in milliseconds between local time and atomic time
}

export function useAtomicTime() {
  const [state, setState] = useState<AtomicTimeState>({
    time: new Date(),
    isSynced: false,
    offset: 0,
  });
  
  const requestRef = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);
  const isSyncedRef = useRef<boolean>(false);

  // Fetch atomic time from API
  const syncTime = useCallback(async () => {
    try {
      // Using worldtimeapi.org - free, no API key required
      const response = await fetch("https://worldtimeapi.org/api/ip");
      const data = await response.json();
      
      // Get the server time
      const serverTime = new Date(data.datetime);
      const localTime = new Date();
      
      // Calculate offset (server time - local time)
      const offset = serverTime.getTime() - localTime.getTime();
      
      offsetRef.current = offset;
      isSyncedRef.current = true;
      
      setState(prev => ({
        ...prev,
        isSynced: true,
        offset: offset,
      }));
      
      console.log(`Synced with atomic time. Offset: ${offset}ms`);
    } catch (error) {
      console.error("Failed to sync with atomic time:", error);
      // Keep using local time if sync fails
    }
  }, []);

  // Update time every frame
  const updateTime = useCallback(() => {
    const now = new Date();
    // Apply offset to get atomic time
    const atomicTime = new Date(now.getTime() + offsetRef.current);
    
    setState(prev => ({
      ...prev,
      time: atomicTime,
    }));
    
    requestRef.current = requestAnimationFrame(updateTime);
  }, []);

  useEffect(() => {
    // Initial sync
    syncTime();
    
    // Re-sync every 5 minutes to stay accurate
    const syncInterval = setInterval(syncTime, 5 * 60 * 1000);
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(updateTime);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      clearInterval(syncInterval);
    };
  }, [syncTime, updateTime]);

  return state;
}

