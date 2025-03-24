import { useState } from 'react';
import toast from 'react-hot-toast';
import css from './UserIdentification.module.css';
import ExTextBox from '../../react-envelope/components/ui/input/text/ExTextBox/ExTextBox';

const UserIdentification = ({ users, onLogin }) => {
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        if (!username.trim()) {
            toast.error('Введите имя пользователя');
            return;
        }
        const user = users.find((u) => u.name === username.trim());
        if (user) {
            onLogin(user);
            toast.success(`Добро пожаловать, ${user.name}!`);
        } else {
            toast.error('Пользователь не найден');
        }
    };

    return (
        <div className={`flex column top-stretch g10 ${css.userIdentification}`}>
            <ExTextBox hint='Имя пользователя'
                        placeholder={'Введите имя пользователя'}
                        text={username}
                        textChanged={(e) => setUsername(e)}/>
            <button onClick={handleLogin}>Войти</button>
        </div>
    );
};

export default UserIdentification;