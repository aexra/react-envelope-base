import { useState } from 'react';
import VBoxPanel from '../../../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import ExTextBox from '../../../../react-envelope/components/ui/input/text/ExTextBox/ExTextBox';
import css from './SuperTextBox.module.css';
import { useStopwatch } from '../../../../react-envelope/hooks/useStopwatch';

/**
 * Рассчитывает скорость печати в символах в минуту (CPM) и словах в минуту (WPM)
 * @param {number[]} intervals - массив интервалов между нажатиями (в мс)
 * @param {number} [pauseThreshold=1000] - интервалы больше этого значения считаются паузами (в мс)
 * @returns {Object} { cpm: number, wpm: number } - символы и слова в минуту
 */
function calculateTypingSpeed(intervals, pauseThreshold = 3000) {
    if (!intervals || intervals.length === 0) return { cpm: 0, wpm: 0 };

    // Фильтруем паузы и слишком короткие интервалы (<50 мс — это, скорее, случайные нажатия)
    const validIntervals = intervals.filter(
        interval => interval >= 50 && interval <= pauseThreshold
    );

    // Если все интервалы — паузы, считаем скорость нулевой
    if (validIntervals.length === 0) return { cpm: 0, wpm: 0 };

    // Средний интервал между валидными нажатиями (в мс)
    const averageInterval = validIntervals.reduce((sum, x) => sum + x, 0) / validIntervals.length;

    // Округленный
    const avi = Math.round(averageInterval);

    // Символы в минуту (CPM) = (60 секунд * 1000 мс) / средний интервал
    const cpm = Math.round(60_000 / averageInterval);

    // Слова в минуту (WPM) = CPM / 5 (стандартное слово = 5 символов)
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

    const handleTextChange = (e) => {
        setText(e);
        if (setValue) setValue(e);

        if (!isRunning) start()
        else {
            const moment = time;
            const interval = moment - lastStop;
            setLastStop(moment);

            setIntervals([...intervals, interval]);
        }
    };

    const speed = () => {
        return calculateTypingSpeed(intervals);
    };

    return (
        <VBoxPanel className={`${className}`} {...props}>
            <ExTextBox text={text}
                        textChanged={handleTextChange}
                        hint={hint}
                        placeholder={placeholder}
                        className={`${inputClassName}`}
                        {...inputProps}/>
            <span className={`${css.counter} h-last`}>{`${speed().avi} ms (${speed().cpm} сим/мин, ${speed().wpm} слов/мин)`}</span>
        </VBoxPanel>
    );
};