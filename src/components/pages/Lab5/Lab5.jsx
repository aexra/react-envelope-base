import { useState } from 'react';
import BasePage from '../../../react-envelope/components/pages/BasePage/BasePage';
import DSTUNavSidebar from '../../../react-envelope/components/widgets/DSTUNavSidebar/DSTUNavSidebar';
import { BP } from '../../dummies/BP/BP';
import { CringeList } from '../../widgets/CringeList/CringeList';
import css from './Lab5.module.css';

export const Lab5 = () => {
    const [bps, setbps] = useState([]);

    const handleAdd = () => {
        setbps([...bps, { mark:'aaa', name:'bbb', power:'228', sata:'5', pci:'1430' }]);
    };

    const handleDelete = (i) => {
        setbps(bps.filter(b => b != bps[i]));
    };

    const handleClear = () => {
        setbps([]);
    };
    
    return (
        <BasePage headerContent={<span>Лабораторная работа №5</span>}
                  navSidebar={<DSTUNavSidebar/>}
                  bodyClassName={`h-full`}>
            <BP mark='aaa' name='bbb' power='228' sata='5' pci='1430'/>
            <CringeList onAddRequested={handleAdd}
                        onDeleteRequested={handleDelete}
                        onClearRequested={handleClear}>
                {bps.map((b, i) => <BP key={i} mark={b.mark} name={b.name} power={b.power} sata={b.sata} pci={b.pci}/>)}
            </CringeList>
        </BasePage>
    );
};