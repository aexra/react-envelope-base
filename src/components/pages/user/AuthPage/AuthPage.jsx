import { User } from "../../../../react-envelope/components/dummies/Icons";
import { IconHeader } from "../../../../react-envelope/components/pages/base/IconHeader";
import { PageBase } from "../../../../react-envelope/components/pages/base/PageBase/PageBase";
import { AuthCard } from "../../../../react-envelope/components/widgets/user/AuthCard/AuthCard";
import css from './AuthPage.module.css';

export const AuthPage = () => {
    return (
        <PageBase header={<IconHeader text={'Личный кабинет'} icon={<User/>}/>}
                  less
                  fullSize>
                <AuthCard className={'center-self'}/>
        </PageBase>
    );
};