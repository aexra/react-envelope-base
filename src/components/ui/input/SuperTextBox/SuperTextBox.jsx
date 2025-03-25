import { useState, useMemo, useCallback } from 'react';
import VBoxPanel from '../../../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import ExTextBox from '../../../../react-envelope/components/ui/input/text/ExTextBox/ExTextBox';
import css from './SuperTextBox.module.css';
import { useStopwatch } from '../../../../react-envelope/hooks/useStopwatch';

function calculateTypingSpeed(intervals, pauseThreshold = 3000) {
    if (!intervals || intervals.length === 0) return { cpm: 0, wpm: 0, avi: 0, avf: 0 };

    const validIntervals = intervals.filter(
        interval => interval >= 50 && interval <= pauseThreshold
    );

    if (validIntervals.length === 0) return { cpm: 0, wpm: 0, avi: 0, avf: 0 };

    const averageInterval = validIntervals.reduce((sum, x) => sum + x, 0) / validIntervals.length;
    const avi = Math.round(averageInterval);
    const cpm = Math.round(60_000 / averageInterval);
    const wpm = Math.round(cpm / 5);

    return { cpm, wpm, avi, avf: averageInterval };
}

export const SuperTextBox = ({
    hint,
    placeholder,
    setValue,
    className,
    inputClassName,
    inputProps,
    details = false,
    ...props
}) => {
    const { time, start, stop, formatted, isRunning } = useStopwatch();
    const [text, setText] = useState('');
    const [intervals, setIntervals] = useState([]);
    const [lastStop, setLastStop] = useState(0);

    // Мемоизируем расчет скорости
    const speed = useMemo(() => calculateTypingSpeed(intervals), [intervals]);

    const handleTextChange = useCallback((e) => {
        setText(e);
        if (setValue) setValue(e);

        const now = Date.now();
        if (!isRunning) {
            start();
            setLastStop(now);
        } else {
            const interval = now - lastStop;
            setLastStop(now);
            setIntervals(prev => [...prev, interval]);
        }
    }, [isRunning, lastStop, setValue, start]);

    return (
        <VBoxPanel className={`${className}`} {...props}>
            <ExTextBox 
                text={text}
                textChanged={handleTextChange}
                hint={hint}
                placeholder={placeholder}
                className={inputClassName}
                wrap
                {...inputProps}
            />
            {details && (
                <span className={`${css.counter} h-last`}>
                    {`${speed.avi} ms (${speed.cpm} сим/мин, ${speed.wpm} слов/мин)`}
                </span>
            )}
        </VBoxPanel>
    );
};