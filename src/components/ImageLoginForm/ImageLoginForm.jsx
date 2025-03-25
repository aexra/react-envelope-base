import { useState } from 'react';
import { UserFilled } from '../../react-envelope/components/dummies/Icons';
import VBoxPanel from '../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import ExTextBox from '../../react-envelope/components/ui/input/text/ExTextBox/ExTextBox';
import { DSTULabeledForm } from '../../react-envelope/components/widgets/DSTULabeledForm/DSTULabeledForm';
import css from './ImageLoginForm.module.css';
import { useImageAuth } from '../../hooks/useImageAuth';
import { ImagePassword } from '../ui/input/ImagePassword/ImagePassword';
import toast from 'react-hot-toast';

export const ImageLoginForm = () => {
    const [username, setUsername] = useState('');
    const { login } = useImageAuth();
    
    const handlePasswordSubmit = (e) => {
        if (login(username, e.join(""))) {
            toast.success(`Добро пожаловать, ${username}!`);
        } else {
            toast.error('Неверное имя или пароль');
        }
    };

    return (
        <DSTULabeledForm iconContent={<UserFilled className='icon-l'/>} label={'Личный кабинет'} className={'flex col g10'}>
            <ExTextBox hint={'Логин'}
                       placeholder={'Введите логин'}
                       text={username}
                       textChanged={setUsername}/>
            <ImagePassword onSubmit={handlePasswordSubmit}/>
        </DSTULabeledForm>
    );
};