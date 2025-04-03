import { useState } from 'react';
import DSTUNavSidebar from '../../../react-envelope/components/widgets/DSTUNavSidebar/DSTUNavSidebar';
import { BP } from '../../dummies/BP/BP';
import { CringeList } from '../../widgets/CringeList/CringeList';
import css from './Lab5.module.css';
import TodoList from '../../widgets/TodoList/TodoList';
import { HeaderTitle } from '../../../react-envelope/components/dummies/styleless/HeaderTitle';
import { ExperimentOutlined } from '../../../react-envelope/components/dummies/Icons';
import { NavSidebarButton } from '../../../react-envelope/components/ui/buttons/NavSidebarButton/NavSidebarButton';
import DSTUFooter from '../../../react-envelope/components/widgets/DSTUFooter/DSTUFooter';
import { PageBase } from '../../../react-envelope/components/pages/base/PageBase/PageBase';

export const Lab5 = () => {
    const [bps, setbps] = useState([]);
    
    const marks = ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj'];
    const names = ['Block1', 'Block2', 'Block3', 'Block4', 'Block5', 'Block6', 'Block7', 'Block8', 'Block9', 'Block10'];
    const powers = ['228', '300', '400', '500', '600', '700', '800', '900', '1000', '1200'];
    const satas = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
    const pcis = ['1430', '1500', '1600', '1700', '1800', '1900', '2000', '2100', '2200', '2300'];

    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    const handleAdd = () => {
        setbps([...bps, {
            mark: getRandomElement(marks),
            name: getRandomElement(names),
            power: getRandomElement(powers),
            sata: getRandomElement(satas),
            pci: getRandomElement(pcis)
        }]);
    };

    const handleDelete = (i) => {
        setbps(bps.filter((b, id) => id !== i));
    };

    const handleClear = () => {
        setbps([]);
    };
    
    return (
        <PageBase>
            <BP mark='aaa' name='bbb' power='228' sata='5' pci='1430'/>
            <CringeList onAddRequested={handleAdd}
                        onDeleteRequested={handleDelete}
                        onClearRequested={handleClear}
                        options={bps.map((b, i) => <BP key={i} mark={b.mark} name={b.name} power={b.power} sata={b.sata} pci={b.pci}/>)}/>
            <TodoList/>
        </PageBase>
    );
};