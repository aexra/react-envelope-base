import { useState } from 'react';
import { useImageAuth } from '../../hooks/useImageAuth';
import VBoxPanel from '../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import css from './ImageAuthForm.module.css';
import { ImageLoginForm } from '../ImageLoginForm/ImageLoginForm';
import { ImageRegisterForm } from '../ImageRegisterForm/ImageRegisterForm';
import ExButton from '../../react-envelope/components/ui/buttons/ExButton/ExButton';

export const ImageAuthForm = ({ users }) => {
    const [isLoginForm, setForm] = useState(true);
    
    return (
        <VBoxPanel gap={'20px'}>
            {isLoginForm ? <ImageLoginForm/> : <ImageRegisterForm onRegister={() => setForm(true)}/>}
            {isLoginForm ? <ExButton className={'linkbutton'} onClick={() => setForm(false)}>Регистрация</ExButton> : 
                           <ExButton className={'linkbutton'} onClick={() => setForm(true )}>Вход</ExButton>}
        </VBoxPanel>
    );
};