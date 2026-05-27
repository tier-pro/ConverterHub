'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function formatTime(ms: number): string {
  const totalMs = Math.floor(ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const millis = totalMs % 1000;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0').slice(0, 2)}`;
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch { /* audio not available */ }
}

export default function StopwatchTimerPage() {
  const [tab, setTab] = useState('stopwatch');
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);

  const [timerMinutes, setTimerMinutes] = useState('1');
  const [timerSeconds, setTimerSeconds] = useState('0');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(60000);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timerEndRef = useRef(0);

  useEffect(() => {
    return () => { if (stopwatchRef.current) clearInterval(stopwatchRef.current); if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startStopwatch = useCallback(() => {
    if (stopwatchRunning) {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
      setStopwatchRunning(false);
    } else {
      startTimeRef.current = Date.now() - stopwatchTime;
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime(Date.now() - startTimeRef.current);
      }, 10);
      setStopwatchRunning(true);
    }
  }, [stopwatchRunning, stopwatchTime]);

  const resetStopwatch = useCallback(() => {
    if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    setStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  }, []);

  const addLap = useCallback(() => {
    setLaps((prev) => [stopwatchTime, ...prev]);
  }, [stopwatchTime]);

  const startTimer = useCallback(() => {
    if (timerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimerRunning(false);
      setTimerPaused(true);
    } else {
      if (!timerPaused) {
        const total = (parseInt(timerMinutes, 10) || 0) * 60000 + (parseInt(timerSeconds, 10) || 0) * 1000;
        setTimerRemaining(total);
        timerEndRef.current = Date.now() + total;
      } else {
        timerEndRef.current = Date.now() + timerRemaining;
      }
      setTimerRunning(true);
      setTimerPaused(false);
      timerRef.current = setInterval(() => {
        const remaining = timerEndRef.current - Date.now();
        if (remaining <= 0) {
          setTimerRemaining(0);
          setTimerRunning(false);
          setTimerPaused(false);
          if (timerRef.current) clearInterval(timerRef.current);
          playBeep();
        } else {
          setTimerRemaining(remaining);
        }
      }, 10);
    }
  }, [timerRunning, timerPaused, timerRemaining, timerMinutes, timerSeconds]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerPaused(false);
    setTimerRemaining((parseInt(timerMinutes, 10) || 0) * 60000 + (parseInt(timerSeconds, 10) || 0) * 1000);
  }, [timerMinutes, timerSeconds]);

  const setPreset = useCallback((seconds: number) => {
    setTimerMinutes(String(Math.floor(seconds / 60)));
    setTimerSeconds(String(seconds % 60));
  }, []);

  const faq = [
    { question: 'How accurate is the stopwatch?', answer: 'The stopwatch updates every 10 milliseconds using JavaScript timers for reasonable accuracy.' },
    { question: 'Does the timer make a sound?', answer: 'Yes, the timer plays a short beep sound using the Web Audio API when the countdown reaches zero.' },
  ];

  const relatedTools = [
    { name: 'Random Generator', path: '/misc-tools/random-generator' },
    { name: 'BMI Calculator', path: '/misc-tools/bmi-calculator' },
  ];

  return (
    <ToolLayout title="Stopwatch & Timer" description="A full-featured stopwatch with lap times and a countdown timer with presets and alert." faq={faq} relatedTools={relatedTools}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setTab('stopwatch')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'stopwatch' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary border border-border'}`}>Stopwatch</button>
          <button onClick={() => setTab('timer')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'timer' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary border border-border'}`}>Timer</button>
        </div>

        {tab === 'stopwatch' && (
          <div className="space-y-4">
            <Card hover={false} className="p-4 text-center">
              <p className="text-5xl font-mono font-bold text-primary">{formatTime(stopwatchTime)}</p>
              <div className="flex justify-center gap-3 mt-4">
                <Button onClick={startStopwatch}>{stopwatchRunning ? 'Stop' : 'Start'}</Button>
                <Button variant="secondary" onClick={resetStopwatch}>Reset</Button>
                <Button variant="secondary" onClick={addLap} disabled={!stopwatchRunning}>Lap</Button>
              </div>
            </Card>

            {laps.length > 0 && (
              <Card hover={false} className="p-4 max-h-48 overflow-y-auto">
                <h3 className="text-sm font-semibold text-text-primary mb-2">Lap Times</h3>
                <div className="space-y-1">
                  {laps.map((lap, i) => (
                    <div key={i} className="flex justify-between text-sm font-mono py-1 border-b border-border/50 last:border-0">
                      <span className="text-text-secondary">Lap {laps.length - i}</span>
                      <span className="font-semibold text-text-primary">{formatTime(lap)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {tab === 'timer' && (
          <div className="space-y-4">
            <Card hover={false} className="p-4 text-center">
              <p className="text-5xl font-mono font-bold text-primary">{formatTime(timerRemaining)}</p>
              <div className="flex justify-center gap-3 mt-4">
                <Button onClick={startTimer}>{timerRunning ? 'Pause' : timerPaused ? 'Resume' : 'Start'}</Button>
                <Button variant="secondary" onClick={resetTimer}>Reset</Button>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Minutes" type="number" min="0" placeholder="1" value={timerMinutes} onChange={(e) => setTimerMinutes(e.target.value)} />
              <Input label="Seconds" type="number" min="0" max="59" placeholder="0" value={timerSeconds} onChange={(e) => setTimerSeconds(e.target.value)} />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: '1 min', seconds: 60 },
                { label: '5 min', seconds: 300 },
                { label: '10 min', seconds: 600 },
                { label: '30 min', seconds: 1800 },
              ].map((preset) => (
                <button key={preset.label} onClick={() => setPreset(preset.seconds)} className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors">{preset.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
