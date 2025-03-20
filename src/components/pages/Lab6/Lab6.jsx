import { useEffect, useState } from 'react';
import BasePage from '../../../react-envelope/components/pages/BasePage/BasePage';
import { CringeList } from '../../widgets/CringeList/CringeList';
import css from './Lab6.module.css';
import { BP } from '../../dummies/BP/BP';
import DSTUNavSidebar from '../../../react-envelope/components/widgets/DSTUNavSidebar/DSTUNavSidebar';
import DSTUFooter from '../../../react-envelope/components/widgets/DSTUFooter/DSTUFooter';
import { HeaderTitle } from '../../../react-envelope/components/dummies/styleless/HeaderTitle';
import { ExperimentOutlined } from '../../../react-envelope/components/dummies/Icons';
import { EditModal } from '../../../react-envelope/components/widgets/modals/EditModal/EditModal';
import toast from 'react-hot-toast';

export const Lab6 = () => {
    const [bps, setbps] = useState([]);

    const [isEditModalEnabled, setIsEditModalEnabled] = useState(false);
    const [editContext, setEditContext] = useState(null);

    const [mark, setMark] = useState(null);
    const [name, setName] = useState(null);
    const [power, setPower] = useState(null);
    const [sata, setSata] = useState(null);
    const [pci, setPci] = useState(null);

    const [editing, setEditing] = useState(null);
        
    const marks = ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj'];
    const names = ['Block1', 'Block2', 'Block3', 'Block4', 'Block5', 'Block6', 'Block7', 'Block8', 'Block9', 'Block10'];
    const powers = ['228', '300', '400', '500', '600', '700', '800', '900', '1000', '1200'];
    const satas = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
    const pcis = ['1430', '1500', '1600', '1700', '1800', '1900', '2000', '2100', '2200', '2300'];

    useEffect(() => {
        if (mark && name && power && sata && pci) {
            setEditContext([
                {
                    hint: 'Марка',
                    placeholder: 'Изменить марку',
                    text: mark,
                    changed: setMark
                },
                {
                    hint: 'Название',
                    placeholder: 'Изменить название',
                    text: name,
                    changed: setName
                },
                {
                    hint: 'Мощность',
                    placeholder: 'Изменить мощность',
                    text: power,
                    changed: setPower
                },
                {
                    hint: 'SATA',
                    placeholder: 'Изменить количество портов SATA',
                    text: sata,
                    changed: setSata
                },
                {
                    hint: 'PCI-E',
                    placeholder: 'Изменить количество портов PCI-E',
                    text: pci,
                    changed: setPci
                }
            ]);
        }
    }, [mark, name, power, sata, pci]);

    useEffect(() => {
        if (editContext) {
            setIsEditModalEnabled(true);
        } else {

        }
    }, [editContext]);

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

    const handleEdit = (i) => {
        setEditing(i);

        const bp = bps[i];

        setMark(bp.mark);
        setName(bp.name);
        setPower(bp.power);
        setSata(bp.sata);
        setPci(bp.pci);
    };

    const handleSave = () => {
        localStorage.setItem("bps", JSON.stringify(bps));
        toast.success('Сохранено!');
    };

    const handleLoad = () => {
        const b = localStorage.getItem("bps");
        if (b) setbps(JSON.parse(b));
        else setbps([]);
    };

    const handleDelete = (i) => {
        setbps(bps.filter((b, id) => id !== i));
    };

    const handleClear = () => {
        setbps([]);
    };

    const handleUpdate = () => {
        if (editing !== null && mark && name && power && sata && pci) {
            const updatedBps = bps.map((bp, index) => 
                index === editing ? { mark, name, power, sata, pci } : bp
            );
    
            setbps(updatedBps);
            setIsEditModalEnabled(false);
            setEditContext(null);
            setEditing(null);

            setMark(null);
            setName(null);
            setPower(null);
            setSata(null);
            setPci(null);
        }
    };
    
    return (
        <BasePage headerContent={<HeaderTitle text='Лабораторная работа №5' icon={<ExperimentOutlined/>}/>}
                  footerContent={<DSTUFooter/>}
                  navSidebar={<DSTUNavSidebar/>}
                  bodyClassName={`h-full`}>
            <CringeList onAddRequested={handleAdd}
                        onEditRequested={handleEdit}
                        onDeleteRequested={handleDelete}
                        onClearRequested={handleClear}
                        onLoadRequested={handleLoad}
                        onSaveRequested={handleSave}
                        options={bps.map((b, i) => <BP key={i} mark={b.mark} name={b.name} power={b.power} sata={b.sata} pci={b.pci}/>)}/>
            <EditModal title={'Изменить блок питания'}
                       isEnabled={isEditModalEnabled}
                       editContext={editContext ?? []}
                       onCloseRequested={() => setIsEditModalEnabled(false)}
                       height='450px'
                       onPrimaryClick={handleUpdate}/>
        </BasePage>
    );
};