import React, { useState } from 'react';
import { Add, Bin, Edit, Reload, Save } from '../../../react-envelope/components/dummies/Icons';
import HBoxPanel from '../../../react-envelope/components/layouts/HBoxPanel/HBoxPanel';
import VBoxPanel from '../../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import ExButton from '../../../react-envelope/components/ui/buttons/ExButton/ExButton';
import VDivider from '../../../react-envelope/components/ui/dividers/VDivider/VDivider';
import css from './CringeList.module.css';

export const CringeListItem = ({ ref, className, children, onDeleteRequested, onEditRequested}) => {
    const [isActive, setIsActive] = useState(true);

    const handleDelete = () => {
        setIsActive(true);
        onDeleteRequested();
    };

    return (
        <div ref={ref}
             className={`${className} ${css.cringeItem}`}>
            {children}
            <HBoxPanel className={`${css.awaitDeleteItemButton}`}>
                <Edit className={`icon-m textbutton pad5 r100`} onClick={onEditRequested}/>
                <Bin className={`icon-m textbutton pad5 r100`} onClick={() => setIsActive(false)}/>
            </HBoxPanel>
            {!isActive && <VBoxPanel className={`${css.mask} r5`} valign='center'>
                <ExButton className={`textbutton`} onClick={() => setIsActive(true)}>Восстановить</ExButton>
                <ExButton className={`textbutton`} onClick={() => handleDelete()}>Удалить</ExButton>
            </VBoxPanel>}
        </div>
    );
};

export const CringeList = ({
    ref, 
    className, 
    onAddRequested, 
    onDeleteRequested, 
    onEditRequested,
    onClearRequested, 
    options,
    onLoadRequested,
    onSaveRequested
}) => {
    return (
        <HBoxPanel gap='0px'
                   ref={ref}
                   className={`${className} ${css.cringe} panel`}>
            <VBoxPanel className={`h-full y-scroll`}
                       gap='10px'
                       halign='start'>
                {options && options.map((c, i) => {
                    return (
                        <CringeListItem key={i} 
                                        onDeleteRequested={() => onDeleteRequested(i)}
                                        onEditRequested={() => onEditRequested(i)}>
                            {c}
                        </CringeListItem>
                    );
                })}
            </VBoxPanel>
            <VDivider className={`v-full`}/>
            <VBoxPanel gap='10px' valign='start'>
                <ExButton className={`textbutton`} onClick={onAddRequested}><Add className='icon-m'/>Добавить</ExButton>
                <ExButton className={'textbutton'} onClick={onSaveRequested}><Save className='icon-m'/>Сохранить</ExButton>
                <ExButton className={'textbutton'} onClick={onLoadRequested}><Reload className='icon-m'/>Загрузить</ExButton>
                <ExButton type={'error'} onClick={onClearRequested}><Bin className='icon-m'/>Очистить</ExButton>
            </VBoxPanel>
        </HBoxPanel>
    );
};