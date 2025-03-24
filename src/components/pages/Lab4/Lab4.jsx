import { ExperimentOutlined } from "../../../react-envelope/components/dummies/Icons";
import { HeaderTitle } from "../../../react-envelope/components/dummies/styleless/HeaderTitle";
import BasePage from "../../../react-envelope/components/pages/BasePage/BasePage";
import DSTUFooter from "../../../react-envelope/components/widgets/DSTUFooter/DSTUFooter";
import DSTUNavSidebar from "../../../react-envelope/components/widgets/DSTUNavSidebar/DSTUNavSidebar";
import { ImageAuthForm } from "../../ImageAuthForm/ImageAuthForm";

export const Lab4 = () => {
    return (
        <BasePage headerContent={<HeaderTitle text='ENVELOPE' icon={<ExperimentOutlined />} />}
                footerContent={<DSTUFooter />}
                navSidebar={<DSTUNavSidebar />}
                bodyGap='10px'>
            <ImageAuthForm/>
        </BasePage>
    );
};