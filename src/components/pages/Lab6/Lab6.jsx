import { ExperimentOutlined } from "../../../react-envelope/components/dummies/Icons";
import { HeaderTitle } from "../../../react-envelope/components/dummies/styleless/HeaderTitle";
import { PageBase } from "../../../react-envelope/components/pages/base/PageBase/PageBase";
import BasePage from "../../../react-envelope/components/pages/BasePage/BasePage";
import DSTUFooter from "../../../react-envelope/components/widgets/DSTUFooter/DSTUFooter";
import DSTUNavSidebar from "../../../react-envelope/components/widgets/DSTUNavSidebar/DSTUNavSidebar";
import { SuperTextBox } from "../../ui/input/SuperTextBox/SuperTextBox";

export const Lab6 = () => {
    const eps = 50;
    
    return (
        <PageBase>
            <SuperTextBox hint={'Контрольная фраза'}
                        placeholder={'Введите фразу'}
                        details
                        limit={20}
                        strictLimit/>
        </PageBase>
    );
};