import { ExperimentOutlined } from "../../../react-envelope/components/dummies/Icons";
import { HeaderTitle } from "../../../react-envelope/components/dummies/styleless/HeaderTitle";
import BasePage from "../../../react-envelope/components/pages/BasePage/BasePage";
import DSTUFooter from "../../../react-envelope/components/widgets/DSTUFooter/DSTUFooter";
import DSTUNavSidebar from "../../../react-envelope/components/widgets/DSTUNavSidebar/DSTUNavSidebar";
import { SuperTextBox } from "../../ui/input/SuperTextBox/SuperTextBox";

export const Lab6 = () => {
    const eps = 50;
    
    return (
        <BasePage headerContent={<HeaderTitle text='ENVELOPE' icon={<ExperimentOutlined />} />}
                footerContent={<DSTUFooter />}
                navSidebar={<DSTUNavSidebar />}
                bodyClassName={'h-full'}
                bodyGap='10px'
                bodyStyle={{
                    backgroundColor: `var(--body-bk-color)`,
                    boxShadow: `0 0 10px rgba(0, 0, 0, 0.5)`,
                    width: '700px'
                }}>
            <SuperTextBox hint={'Контрольная фраза'}
                        placeholder={'Введите фразу'}
                        details
                        limit={20}
                        strictLimit/>
        </BasePage>
    );
};