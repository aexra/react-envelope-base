import { useImageAuth } from "../../../hooks/useImageAuth";
import { ExperimentOutlined, Logout } from "../../../react-envelope/components/dummies/Icons";
import { HeaderTitle } from "../../../react-envelope/components/dummies/styleless/HeaderTitle";
import VBoxPanel from "../../../react-envelope/components/layouts/VBoxPanel/VBoxPanel";
import BasePage from "../../../react-envelope/components/pages/BasePage/BasePage";
import ExButton from "../../../react-envelope/components/ui/buttons/ExButton/ExButton";
import DSTUFooter from "../../../react-envelope/components/widgets/DSTUFooter/DSTUFooter";
import DSTUNavSidebar from "../../../react-envelope/components/widgets/DSTUNavSidebar/DSTUNavSidebar";
import { ImageAuthForm } from "../../ImageAuthForm/ImageAuthForm";

export const Lab4 = () => {
    const { user, logout } = useImageAuth();

    return (
        <BasePage headerContent={<HeaderTitle text='ENVELOPE' icon={<ExperimentOutlined />} />}
                footerContent={<DSTUFooter />}
                navSidebar={<DSTUNavSidebar />}
                bodyGap='10px'>
            {user ? <VBoxPanel gap={'10px'}>
                <h2>Здравствйте, {user?.name}!</h2>
                <ExButton className={'accent-button'} onClick={() => logout()}><Logout className='icon-m'/>Выйти</ExButton>
            </VBoxPanel> : <ImageAuthForm/>}
        </BasePage>
    );
};