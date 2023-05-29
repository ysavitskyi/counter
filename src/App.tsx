import { useCallback, useState, useEffect, useRef } from 'react'
import './App.css'

const DIMENSION = 3
const TIME_INTERVAL = 1000

const App: React.FC = () => {
  const [increment, setIncrement] = useState(1)
  const [result, setResult] = useState(0)
  const [timer, setTimer] = useState<null | ReturnType<typeof setInterval>>(
    null
  )
  const timerRef = useRef(timer)
  timerRef.current = timer

  const initIncrementation = useCallback((increment: number) => {
    const timerId = setInterval(() => {
      setResult((result) => result + increment)
    }, TIME_INTERVAL)
    setTimer(timerId)
  }, [])

  const stopIncrementation = useCallback(
    (cb?: () => void) => {
      if (timer) {
        clearInterval(timer)
        setTimer(null)

        cb && cb()
      }
    },
    [timer]
  )

  const startCounter = useCallback(() => {
    initIncrementation(increment)
  }, [increment, initIncrementation])

  const stopCounter = useCallback(() => {
    stopIncrementation()
  }, [stopIncrementation])

  const resetCounter = useCallback(() => {
    stopCounter()
    setResult(0)
    setIncrement(1)
  }, [stopCounter])

  const onClickInc = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const index = +(event.target as HTMLButtonElement).value

      setIncrement(index)
      stopIncrementation(initIncrementation.bind(null, index))
    },
    [stopIncrementation, initIncrementation]
  )

  useEffect(() => {
    return () => {
      timerRef.current && clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div className="game">
      <ul
        className="grid"
        style={{ gridTemplateColumns: `repeat(${DIMENSION}, 1fr)` }}
      >
        {[...Array(DIMENSION ** 2)].map((_, index) => (
          <li
            key={index}
            className={`cell ${index === increment - 1 && 'cell--active'}`}
          >
            <button className="cell-in" value={index + 1} onClick={onClickInc}>
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
      <div>
        <div className="controls">
          <button
            type="button"
            className="control"
            onClick={startCounter}
            disabled={timer !== null}
          >
            start
          </button>
          <button
            type="button"
            className="control"
            onClick={stopCounter}
            disabled={timer === null}
          >
            stop
          </button>

          <button
            type="button"
            className="control"
            onClick={resetCounter}
            disabled={result === 0}
          >
            reset
          </button>
        </div>
        <div className="result">result: {result}</div>
      </div>
    </div>
  )
}

export default App
