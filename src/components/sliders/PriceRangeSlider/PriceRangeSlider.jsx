import { useState, useCallback, useEffect, useRef } from 'react';
import css from './PriceRangeSlider.module.css';
import { ArrowLeftSquare, ArrowRightSquare } from '../../../react-envelope/components/dummies/Icons';
import ExTextBox from '../../../react-envelope/components/ui/input/text/ExTextBox/ExTextBox';
import ExButton from '../../../react-envelope/components/ui/buttons/ExButton/ExButton';


function PriceRangeSlider({ min = 0, max = 100000, onChange }) {
    const [minValue, setMinValue] = useState(12340);
    const [maxValue, setMaxValue] = useState(40350);
    const [activeThumb, setActiveThumb] = useState(null);
    const sliderRef = useRef(null);
    const isInitialMount = useRef(true);

    const updateValues = useCallback((newMin, newMax) => {
        const clampedMin = Math.max(min, Math.min(newMin, newMax - 1));
        const clampedMax = Math.min(max, Math.max(newMax, newMin + 1));
        setMinValue(clampedMin);
        setMaxValue(clampedMax);
    }, [min, max]);

    const handleInputChange = (value, type) => {
        const numValue = parseInt(value) || min;
        if (type === 'min') {
            updateValues(numValue, maxValue);
        } else {
            updateValues(minValue, numValue);
        }
    };

    const handleThumbMouseDown = (thumb, e) => {
        e.stopPropagation();
        setActiveThumb(thumb);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);
    };

    const handleMouseMove = useCallback((e) => {
        if (!activeThumb || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const position = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        const newValue = Math.round(min + position * (max - min));

        if (activeThumb === 'min') {
            setMinValue(Math.min(newValue, maxValue - 1));
        } else {
            setMaxValue(Math.max(newValue, minValue + 1));
        }
    }, [activeThumb, minValue, maxValue, min, max]);

    const handleMouseUp = useCallback(() => {
        setActiveThumb(null);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSliderClick = (e) => {
        if (activeThumb || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const minPosition = (minValue - min) / (max - min);
        const maxPosition = (maxValue - min) / (max - min);

        const distanceToMin = Math.abs(clickPosition - minPosition);
        const distanceToMax = Math.abs(clickPosition - maxPosition);

        const closestThumb = distanceToMin < distanceToMax ? 'min' : 'max';
        setActiveThumb(closestThumb);
        handleMouseMove(e);
    };

    const handleKeyDown = (e, type) => {
        const step = e.shiftKey ? 1000 : 100;
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (type === 'min') {
                updateValues(minValue + step, maxValue);
            } else {
                updateValues(minValue, maxValue + step);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (type === 'min') {
                updateValues(minValue - step, maxValue);
            } else {
                updateValues(minValue, maxValue - step);
            }
        }
    };

    const handleApply = () => {
        onChange?.({ min: minValue, max: maxValue });
    };

    const handleReset = () => {
        setMinValue(min);
        setMaxValue(max);
    };

    const minPercent = ((minValue - min) / (max - min)) * 100;
    const maxPercent = ((maxValue - min) / (max - min)) * 100;

    return (
        <div className={css.container}>
            <div className={css.header}>Price Filter</div>

            <div className={css.rangeInputs}>
                <div className={css.inputGroup}>
                    <label>From:</label>
                    <ExTextBox
                        text={minValue.toString()}
                        textChanged={(value) => handleInputChange(value, 'min')}
                        onKeyDown={(e) => handleKeyDown(e, 'min')}
                        borderless
                        className={css.input}
                    />
                </div>

                <div className={css.inputGroup}>
                    <label>To:</label>
                    <ExTextBox
                        text={maxValue.toString()}
                        textChanged={(value) => handleInputChange(value, 'max')}
                        onKeyDown={(e) => handleKeyDown(e, 'max')}
                        borderless
                        className={css.input}
                    />
                </div>
            </div>

            <div
                ref={sliderRef}
                className={css.slider}
                onMouseDown={handleSliderClick}
                onMouseLeave={handleMouseUp}
            >
                <div className={css.sliderTrack} />
                <div
                    className={css.sliderRange}
                    style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`
                    }}
                />

                <div
                    className={`${css.thumb} ${activeThumb === 'min' ? css.active : ''}`}
                    style={{ left: `${minPercent}%` }}
                    onMouseDown={(e) => handleThumbMouseDown('min', e)}
                >
                    <ArrowLeftSquare className={css.thumbIcon} />
                </div>

                <div
                    className={`${css.thumb} ${activeThumb === 'max' ? css.active : ''}`}
                    style={{ left: `${maxPercent}%` }}
                    onMouseDown={(e) => handleThumbMouseDown('max', e)}
                >
                    <ArrowRightSquare className={css.thumbIcon} />
                </div>
            </div>

            <div className={css.actions}>
                <ExButton
                    onClick={handleReset}
                    type="info"
                >
                    Cancel
                </ExButton>
                <ExButton
                    onClick={handleApply}
                    type="success"
                >
                    Apply
                </ExButton>
            </div>
        </div>
    );
}

export default PriceRangeSlider;