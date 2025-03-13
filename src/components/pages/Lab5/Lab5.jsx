import BasePage from '../../../react-envelope/components/pages/BasePage/BasePage';
import DSTUNavSidebar from '../../../react-envelope/components/widgets/DSTUNavSidebar/DSTUNavSidebar';
import { BP } from '../../dummies/BP/BP';
import css from './Lab5.module.css';

export const Lab5 = () => {
    return (
        <BasePage headerContent={<span>Лабораторная работа №5</span>}
                  navSidebar={<DSTUNavSidebar/>}
                  bodyClassName={`h-full`}>
            <BP mark='aaa' name='bbb' power='228' sata='5' pci='1430'/>
        </BasePage>
    );
};