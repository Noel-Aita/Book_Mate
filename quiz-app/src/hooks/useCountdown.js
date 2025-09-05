// src/hooks/useCountdown.js
import { useState, useEffect } from "react";

const useCountdown = (initialSeconds, onTimeUp) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const reset = (newSeconds) => setSeconds(newSeconds);

  return { seconds, reset };
};

export default useCountdown;
