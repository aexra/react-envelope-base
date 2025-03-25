import { useState, useRef, useEffect } from 'react';
import css from './ImagePassword.module.css';

export const ImagePassword = ({
    ref,
    className,
    onSubmit,
    onInput,
    onPatternComplete,
    dotSize = 24,
    lineColor = 'var(--accent-color)',
    minPoints = 4,
    multiple = false,
    ...props
}) => {
    const [dots, setDots] = useState([]);
    const [activeDots, setActiveDots] = useState([]);
    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(null);
    const containerRef = useRef(null);

    // Инициализация точек
    useEffect(() => {
        const newDots = [];
        const dotPositions = [
            [0, 0], [1, 0], [2, 0],
            [0, 1], [1, 1], [2, 1],
            [0, 2], [1, 2], [2, 2]
        ];
        
        dotPositions.forEach(([col, row]) => {
            newDots.push({
                id: row * 3 + col + 1,
                x: (col * 100) + 50,
                y: (row * 100) + 50,
                active: false
            });
        });
        
        setDots(newDots);
    }, []);

    const isPointNear = (x, y, dot) => {
        const distance = Math.sqrt(Math.pow(x - dot.x, 2) + Math.pow(y - dot.y, 2));
        return distance < dotSize * 1.5;
    };

    const handleStart = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        const clickedDot = dots.find(dot => isPointNear(x, y, dot));
        if (clickedDot) {
            setIsDrawing(true);
            const updatedDots = dots.map(dot => 
                dot.id === clickedDot.id ? { ...dot, active: true } : dot
            );
            setDots(updatedDots);
            setActiveDots([clickedDot.id]);
        }
    };

    const handleMove = (e) => {
        if (!isDrawing) return;
        
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        // Обновляем позицию курсора для интерактивной линии
        setCursorPosition({ x, y });
        
        const newLines = [...lines];
        const newActiveDots = [...activeDots];
        
        const newDot = dots.find(dot => 
            !activeDots.includes(dot.id) && isPointNear(x, y, dot)
        );
        
        if (newDot) {
            const updatedDots = dots.map(dot => 
                dot.id === newDot.id ? { ...dot, active: true } : dot
            );
            setDots(updatedDots);
            
            const lastDotId = activeDots[activeDots.length - 1];
            const lastDot = dots.find(dot => dot.id === lastDotId);
            
            if (lastDot) {
                newLines.push({
                    x1: lastDot.x,
                    y1: lastDot.y,
                    x2: newDot.x,
                    y2: newDot.y
                });
            }
            
            newActiveDots.push(newDot.id);
            setActiveDots(newActiveDots);

            if (onInput) onInput(newActiveDots);

            setLines(newLines);

            // Сбрасываем позицию курсора после соединения точек
            setCursorPosition(null);
        }
    };

    const handleEnd = () => {
        setCursorPosition(null);
        if (isDrawing && activeDots.length > 0) {
            setIsDrawing(false);
            
            if (activeDots.length >= minPoints) {
                if (onPatternComplete) {
                    onPatternComplete(activeDots);
                }
                if (onSubmit) {
                    onSubmit(activeDots);
                }
            }
            setTimeout(resetPattern, 1000);
        }
    };

    const resetPattern = () => {
        setDots(dots.map(dot => ({ ...dot, active: false })));
        setActiveDots([]);
        setLines([]);
        setIsDrawing(false);
        setCursorPosition(null);
    };

    // Получаем последнюю активную точку для интерактивной линии
    const getLastActiveDot = () => {
        if (activeDots.length === 0) return null;
        const lastDotId = activeDots[activeDots.length - 1];
        return dots.find(dot => dot.id === lastDotId);
    };

    const lastActiveDot = getLastActiveDot();

    return (
        <div className={`${css.container} ${className}`} {...props}>
            <div 
                ref={containerRef}
                className={css.passwordArea}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            >
                {/* Постоянные линии между точками */}
                {lines.map((line, index) => {
                    const length = Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
                    const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
                    
                    return (
                        <div 
                            key={`line-${index}`}
                            className={css.line}
                            style={{
                                width: `${length}px`,
                                left: `${line.x1}px`,
                                top: `${line.y1}px`,
                                transform: `rotate(${angle}rad)`,
                                backgroundColor: lineColor
                            }}
                        />
                    );
                })}
                
                {/* Интерактивная линия к курсору */}
                {isDrawing && lastActiveDot && cursorPosition && (
                    <div 
                        className={css.tempLine}
                        style={{
                            width: `${Math.sqrt(
                                Math.pow(cursorPosition.x - lastActiveDot.x, 2) + 
                                Math.pow(cursorPosition.y - lastActiveDot.y, 2)
                            )}px`,
                            left: `${lastActiveDot.x}px`,
                            top: `${lastActiveDot.y}px`,
                            transform: `rotate(${Math.atan2(
                                cursorPosition.y - lastActiveDot.y, 
                                cursorPosition.x - lastActiveDot.x
                            )}rad)`,
                            backgroundColor: lineColor,
                            opacity: 0.6
                        }}
                    />
                )}
                
                {/* Точки */}
                {dots.map(dot => (
                    <div 
                        key={`dot-${dot.id}`}
                        className={`${css.dot} ${dot.active ? css.active : ''}`}
                        style={{
                            left: `${dot.x}px`,
                            top: `${dot.y}px`,
                            width: `${dotSize}px`,
                            height: `${dotSize}px`,
                            '--line-color': lineColor,
                            '--dot-size': `${dotSize}px`
                        }}
                    />
                ))}
            </div>
            
            <button 
                className={css.resetButton}
                onClick={resetPattern}
            >
                Сбросить
            </button>
        </div>
    );
};