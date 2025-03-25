import { useState } from 'react';
import VBoxPanel from '../../../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import ExTextBox from '../../../../react-envelope/components/ui/input/text/ExTextBox/ExTextBox';
import css from './SuperTextBox.module.css';
import { useStopwatch } from '../../../../react-envelope/hooks/useStopwatch';

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
    const [speed, setSpeed] = useState();

    var lastStop = null;

    const handleTextChange = (e) => {
        setText(e);
        if (setValue) setValue(e);

        if (!isRunning) start()
        else {
            const interval = time - lastStop;
            const formatint = formatted(interval);
            setSpeed(formatint);
        }
    };

    return (
        <VBoxPanel className={`${className}`} {...props}>
            <ExTextBox text={text}
                        textChanged={handleTextChange}
                        hint={hint}
                        placeholder={placeholder}
                        className={`${inputClassName}`}
                        {...inputProps}/>
            <span className={`${css.counter} h-last`}>{speed}</span>
        </VBoxPanel>
    );
};