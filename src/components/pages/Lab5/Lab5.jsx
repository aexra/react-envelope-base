import { useState } from 'react';
import BasePage from '../../../react-envelope/components/pages/BasePage/BasePage';
import DSTUNavSidebar from '../../../react-envelope/components/widgets/DSTUNavSidebar/DSTUNavSidebar';
import { BP } from '../../dummies/BP/BP';
import { CringeList } from '../../widgets/CringeList/CringeList';
import css from './Lab5.module.css';

export const Lab5 = () => {
    const [bps, setbps] = useState([]);

    const handleAdd = (i) => {
        setbps(bps.slice(i, i + 1));
    };

    const handleDelete = (i) => {
        setbps([...bps, <BP/>]);
    };
    
    return (
        <BasePage headerContent={<span>Лабораторная работа №5</span>}
                  navSidebar={<DSTUNavSidebar/>}
                  bodyClassName={`h-full`}>
            <BP mark='aaa' name='bbb' power='228' sata='5' pci='1430'/>
            <CringeList onAddRequested={handleAdd}
                        onDeleteRequested={handleDelete}>
                {bps}
            </CringeList>
        </BasePage>
    );
};