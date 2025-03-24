import { useState } from 'react';
import { UserFilled } from '../../react-envelope/components/dummies/Icons';
import VBoxPanel from '../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import { DSTULabeledForm } from '../../react-envelope/components/widgets/DSTULabeledForm/DSTULabeledForm';
import css from './ImageRegisterForm.module.css';
import ExTextBox from '../../react-envelope/components/ui/input/text/ExTextBox/ExTextBox';
import ExButton from '../../react-envelope/components/ui/buttons/ExButton/ExButton';
import { useImageAuth } from '../../hooks/useImageAuth';
import toast from 'react-hot-toast';

export const ImageRegisterForm = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useImageAuth();

    const handleRegister = () => {
        const result = register(username, password);

        if (result) {
            toast.success(`${username}, вы успешно зарегистрированы!`);
            if (onRegister) onRegister();
        } else {
            toast.error('Ошибка при регистрации');
        }
    };

    return (
        <DSTULabeledForm iconContent={<UserFilled className='icon-l'/>} label={'Регистрация'} className={'flex col g10'}>
            <ExTextBox hint={'Логин'}
                       placeholder={'Введите логин'}
                       text={username}
                       textChanged={setUsername}/>
            <ExButton className={'accent-button'} onClick={handleRegister}>Зарегистрироваться</ExButton>
        </DSTULabeledForm>
    );
};