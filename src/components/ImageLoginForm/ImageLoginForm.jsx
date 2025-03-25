import { useEffect, useState } from 'react';
import { UserFilled } from '../../react-envelope/components/dummies/Icons';
import VBoxPanel from '../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import ExTextBox from '../../react-envelope/components/ui/input/text/ExTextBox/ExTextBox';
import { DSTULabeledForm } from '../../react-envelope/components/widgets/DSTULabeledForm/DSTULabeledForm';
import css from './ImageLoginForm.module.css';
import { useImageAuth } from '../../hooks/useImageAuth';
import { ImagePassword } from '../ui/input/ImagePassword/ImagePassword';
import toast from 'react-hot-toast';
import bonk from '../../assets/bonk.png';
import HBoxPanel from '../../react-envelope/components/layouts/HBoxPanel/HBoxPanel';

export const ImageLoginForm = ({ onBadLogin }) => {
    const [username, setUsername] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const { lock, attempts, login, lockUser, countAttempt } = useImageAuth();
    
    const handleBadLogin = () => {
        countAttempt();
        if (onBadLogin) onBadLogin();
    };

    const handlePasswordSubmit = (e) => {
        if (login(username, e.join(""))) {
            toast.success(`Добро пожаловать, ${username}!`);
        } else {
            toast.error('Неверное имя или пароль');
            handleBadLogin();
        }
    };

    useEffect(() => {
        if (attempts > 2) {
            setIsLocked(true);
            lockUser(5);
        }
    }, [attempts]);

    useEffect(() => {
        if (!lock || lock == 0) {
            setIsLocked(false);
        }
    }, [lock]);

    return (
        <DSTULabeledForm iconContent={<UserFilled className='icon-l'/>} label={'Личный кабинет'} className={`flex col g10 ${css.panel}`}>
            <ExTextBox hint={'Логин'}
                       placeholder={'Введите логин'}
                       text={username}
                       textChanged={setUsername}/>
            <ImagePassword onSubmit={handlePasswordSubmit}/>
            {isLocked && <div className={`${css.lock} flex col center g10`}>
                <h1 className={css.title}>Ты в бане!</h1>
                <img src={bonk} className={css.bonk}/>
                <HBoxPanel gap={'10px'}>
                    <h1 className={css.remainTitle}>Осталось: </h1>
                    <h1 className={css.remainCounter}>{lock}</h1>
                </HBoxPanel>
            </div>}
        </DSTULabeledForm>
    );
};