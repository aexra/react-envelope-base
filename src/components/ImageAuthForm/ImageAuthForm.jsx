import { useState } from 'react';
import { useImageAuth } from '../../hooks/useImageAuth';
import VBoxPanel from '../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import css from './ImageAuthForm.module.css';
import { ImageLoginForm } from '../ImageLoginForm/ImageLoginForm';
import { ImageRegisterForm } from '../ImageRegisterForm/ImageRegisterForm';

export const ImageAuthForm = ({ users }) => {
    const [isLoginForm, setForm] = useState(true);
    
    return (
        isLoginForm ? <ImageLoginForm/> : <ImageRegisterForm/>
    );
};