import { useCallback, useEffect, useState } from 'react';
import clickSound from './ClickSound.m4a';

function Calculator({ workouts, allowSound }) {
  const [number, setNumber] = useState(workouts.at(0).numExercises);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);

  const [duration, setDuration] = useState(0);

  // const playSound = useCallback(
  //   function () {
  //     if (!allowSound) return;
  //     const sound = new Audio(clickSound);
  //     sound.play();
  //   },
  //   [allowSound]
  // );

  // Each side effect should only be responsible for one effect.
  // The firs tis responsible for setting duration
  // the 2nd is responsible for playing the sound

  /** classic example of useEffect to update state on another state update
   *  - not always the best solution (avoid when possible since this runs after the initial
   *    render and updating state will then cause another render) but ok here since otherwise
   *    this logic would be repeated in 4 other event handlers
   */
  useEffect(() => {
    setDuration((number * sets * speed) / 60 + (sets - 1) * durationBreak);
  }, [number, sets, speed, durationBreak]);

  /** Better solution to keeping the playSound synchronized with the duration state
   *  - have the playSound function in here without the useCallback
   *  - since basically we want to playSound whenever the duration changes
   */
  useEffect(() => {
    const playSound = () => {
      if (!allowSound) return;
      const sound = new Audio(clickSound);
      sound.play();
    };

    playSound();
  }, [duration, allowSound]);

  /** Closure with the original render snapshot
   *  - if nothing in the dependency array it will be a stale closure
   *  - any values used in useEffect that are not in the dependency array
   *    will remain stale and the closure will be considered stale
   */
  useEffect(() => {
    document.title = `Your ${number}-exercise workout`;
  }, [number]);

  // convert this to useState ^^
  // const duration = (number * sets * speed) / 60 + (sets - 1) * durationBreak;
  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  const handleInc = () => {
    setDuration((duration) => Math.floor(duration + 1));
  };

  const handleDec = () => {
    setDuration((duration) => (duration > 1 ? Math.ceil(duration - 1) : 0));
  };

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => setNumber(+e.target.value)}>
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => setDurationBreak(e.target.value)}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={handleDec}>–</button>
        <p>
          {mins < 10 && '0'}
          {mins}:{seconds < 10 && '0'}
          {seconds}
        </p>
        <button onClick={handleInc}>+</button>
      </section>
    </>
  );
}

export default Calculator;
