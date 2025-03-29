import { useState, useEffect } from 'react';
import css from './ExCheckbox.module.css';
import { CheckedIcon, CheckboxMinus, IndeterminateIcon } from '../../react-envelope/components/dummies/Icons';

function ExCheckbox({
    className,
    type = 'info',
    state = 'indeterminate',
    onChange
}) {
    const [checkboxState, setCheckboxState] = useState(state);
    const [isMounted, setIsMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setCheckboxState(state);
    }, [state]);

    const styles = {
        'info': css.info,
        'success': css.success,
        'warning': css.warning,
        'error': css.error,
        'tip': css.tip
    };

    const handleClick = () => {
        setIsAnimating(true);
        const newState =
            checkboxState === 'indeterminate' ? 'checked' :
                checkboxState === 'checked' ? 'unchecked' :
                    'indeterminate';

        setCheckboxState(newState);
        onChange && onChange(newState);

        setTimeout(() => setIsAnimating(false), 200);
    };

    const iconProps = {
        className: `${css.icon} ${isAnimating ? css.animating : ''}`,
        fill: type === 'info' ? 'var(--accent-font-color)' : 'currentColor'
    };

    return (
        <div
            className={`${className} ${css.checkbox} ${styles[type]} ${isAnimating ? css.animating : ''} ${isMounted ? css.mounted : ''}`}
            onClick={handleClick}
        >
            {checkboxState === 'checked' && <CheckedIcon {...iconProps} />}
            {checkboxState === 'indeterminate' && <IndeterminateIcon {...iconProps} />}
            {checkboxState === 'unchecked' && <CheckboxMinus {...iconProps} />}
        </div>
    );
}

export default ExCheckbox;