import { useState } from 'react';
import { UserFilled } from '../../react-envelope/components/dummies/Icons';
import VBoxPanel from '../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import ExTextBox from '../../react-envelope/components/ui/input/text/ExTextBox/ExTextBox';
import { DSTULabeledForm } from '../../react-envelope/components/widgets/DSTULabeledForm/DSTULabeledForm';
import css from './ImageLoginForm.module.css';
import { useImageAuth } from '../../hooks/useImageAuth';

export const ImageLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useImageAuth();
    
    return (
        <DSTULabeledForm iconContent={<UserFilled className='icon-l'/>} label={'Личный кабинет'} className={'flex col g10'}>
            <ExTextBox hint={'Логин'}
                       placeholder={'Введите логин'}
                       text={username}
                       textChanged={setUsername}/>
        </DSTULabeledForm>
    );
};