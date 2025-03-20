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
    const [isCreateModalEnabled, setIsCreateModalEnabled] = useState(false);
    const [editContext, setEditContext] = useState(null);

    const [mark, setMark] = useState('');
    const [name, setName] = useState('');
    const [power, setPower] = useState('');
    const [sata, setSata] = useState('');
    const [pci, setPci] = useState('');

    const [editing, setEditing] = useState(null);

    useEffect(() => {
        if (isCreateModalEnabled) return;
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
        }
    }, [editContext]);

    const handleAdd = () => {
        setIsCreateModalEnabled(true);
    };

    const handleCreate = (event) => {
        event.preventDefault();
        setbps([...bps, {
            mark: mark,
            name: name,
            power: power,
            sata: sata,
            pci: pci
        }]);
        setIsCreateModalEnabled(false);
        setMark('');
        setName('');
        setPower('');
        setSata('');
        setPci('');
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

            setMark('');
            setName('');
            setPower('');
            setSata('');
            setPci('');
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
            {isCreateModalEnabled && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsCreateModalEnabled(false)}>&times;</span>
                        <form onSubmit={handleCreate}>
                            <label>
                                Марка:
                                <input type="text" value={mark} onChange={(e) => setMark(e.target.value)} required />
                            </label>
                            <label>
                                Название:
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </label>
                            <label>
                                Мощность:
                                <input type="text" value={power} onChange={(e) => setPower(e.target.value)} required />
                            </label>
                            <label>
                                SATA:
                                <input type="text" value={sata} onChange={(e) => setSata(e.target.value)} required />
                            </label>
                            <label>
                                PCI-E:
                                <input type="text" value={pci} onChange={(e) => setPci(e.target.value)} required />
                            </label>
                            <button type="submit">Создать</button>
                        </form>
                    </div>
                </div>
            )}
        </BasePage>
    );
};