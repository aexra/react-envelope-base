import { UserFilled } from '../../react-envelope/components/dummies/Icons';
import VBoxPanel from '../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import { DSTULabeledForm } from '../../react-envelope/components/widgets/DSTULabeledForm/DSTULabeledForm';
import css from './ImageLoginForm.module.css';

export const ImageLoginForm = () => {
    return (
        <DSTULabeledForm iconContent={<UserFilled className='icon-l'/>} label={'Личный кабинет'}>

        </DSTULabeledForm>
    );
};