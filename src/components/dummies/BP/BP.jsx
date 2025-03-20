import { useState } from 'react';
import HBoxPanel from '../../../react-envelope/components/layouts/HBoxPanel/HBoxPanel';
import VBoxPanel from '../../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import HDivider from '../../../react-envelope/components/ui/dividers/HDivider/HDivider';
import css from './BP.module.css';

export const BP = ({ ref, className, mark, name, power, sata, pci}) => {
    return (
        <HBoxPanel ref={ref} 
                   className={`${className} panel ${css.bp}`} 
                   gap='20px'>
            <VBoxPanel>
                <span><b>Марка</b></span>
                <HDivider/>
                <span><b>Название</b></span>
                <span><b>Мощность</b></span>
                <span><b>Количество SATA</b></span>
                <span><b>Количество PCI</b></span>
            </VBoxPanel>
            <VBoxPanel className={css.values}>
                <span>{mark}</span>
                <HDivider/>
                <span>{name}</span>
                <span>{power}</span>
                <span>{sata}</span>
                <span>{pci}</span>
            </VBoxPanel>
        </HBoxPanel>
    );
};