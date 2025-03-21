import { useState } from 'react';
import toast from 'react-hot-toast';
import css from './Console.module.css';

const Console = ({ onCommand, prompt = 'Жду ваших указаний >' }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) {
            toast.error('Введите команду');
            return;
        }
        onCommand(input.trim());
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className={css.console}>
            <span>{prompt}</span>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
            />
        </form>
    );
};

export default Console;