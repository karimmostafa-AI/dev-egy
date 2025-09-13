import CountdownTimer from '../CountdownTimer';

export default function CountdownTimerExample() {
  return (
    <div className="p-4">
      <CountdownTimer initialHours={5} initialMinutes={47} initialSeconds={9} />
    </div>
  );
}