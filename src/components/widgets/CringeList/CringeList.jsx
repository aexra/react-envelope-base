import React, { useState } from 'react';
import { Add, Bin } from '../../../react-envelope/components/dummies/Icons';
import HBoxPanel from '../../../react-envelope/components/layouts/HBoxPanel/HBoxPanel';
import VBoxPanel from '../../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import ExButton from '../../../react-envelope/components/ui/buttons/ExButton/ExButton';
import VDivider from '../../../react-envelope/components/ui/dividers/VDivider/VDivider';
import css from './CringeList.module.css';

export const CringeListItem = ({ ref, className, children, onDeleteRequested}) => {
    const [isActive, setIsActive] = useState(true);

    return (
        <div ref={ref}
             className={`${className} ${css.cringeItem}`}>
            {children}
            <Bin className={`${css.awaitDeleteItemButton} icon-m textbutton pad5 r100`} onClick={() => setIsActive(false)}/>
            {!isActive && <VBoxPanel className={`${css.mask} r5`} valign='center'>
                <ExButton className={`textbutton`} onClick={() => setIsActive(true)}>Восстановить</ExButton>
                <ExButton className={`textbutton`} onClick={() => onDeleteRequested()}>Удалить</ExButton>
            </VBoxPanel>}
        </div>
    );
};

export const CringeList = ({ ref, className, children, onAddRequested, onDeleteRequested, onClearRequested }) => {
    const handleOnDeleteSingle = (i) => {
        if (onDeleteRequested) onDeleteRequested(i);
        console.log(`Delete `, i);
    };

    return (
        <HBoxPanel gap='0px'
                   ref={ref}
                   className={`${className} ${css.cringe} panel`}>
            <VBoxPanel className={`h-full y-scroll`}
                       gap='10px'>
                {React.Children.toArray(children).map((c, i) => {
                    return (
                        <CringeListItem key={i} onDeleteRequested={() => handleOnDeleteSingle(i)}>
                            {c}
                        </CringeListItem>
                    );
                })}
            </VBoxPanel>
            <VDivider className={`v-full`}/>
            <VBoxPanel gap='10px' valign='start'>
                <ExButton className={`textbutton`} onClick={onAddRequested}><Add className='icon-m'/> Добавить</ExButton>
                <ExButton className={`textbutton ${css.clear}`} gap='10px' onClick={onClearRequested}><Bin className='icon-s'/> Очистить</ExButton>
            </VBoxPanel>
        </HBoxPanel>
    );
};