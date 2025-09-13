import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}

export default function CountdownTimer({ 
  initialHours = 5, 
  initialMinutes = 47, 
  initialSeconds = 9 
}: CountdownTimerProps) {
  const [time, setTime] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center space-x-2" data-testid="countdown-timer">
      <div className="bg-foreground text-background px-2 py-1 rounded font-bold text-lg min-w-[2.5rem] text-center" data-testid="hours">
        {formatNumber(time.hours)}
      </div>
      <span className="text-foreground font-bold text-lg">:</span>
      <div className="bg-foreground text-background px-2 py-1 rounded font-bold text-lg min-w-[2.5rem] text-center" data-testid="minutes">
        {formatNumber(time.minutes)}
      </div>
      <span className="text-foreground font-bold text-lg">:</span>
      <div className="bg-foreground text-background px-2 py-1 rounded font-bold text-lg min-w-[2.5rem] text-center" data-testid="seconds">
        {formatNumber(time.seconds)}
      </div>
    </div>
  );
}