import { Add, Bin } from '../../../react-envelope/components/dummies/Icons';
import HBoxPanel from '../../../react-envelope/components/layouts/HBoxPanel/HBoxPanel';
import VBoxPanel from '../../../react-envelope/components/layouts/VBoxPanel/VBoxPanel';
import ExButton from '../../../react-envelope/components/ui/buttons/ExButton/ExButton';
import VDivider from '../../../react-envelope/components/ui/dividers/VDivider/VDivider';
import css from './CringeList.module.css';

export const CringeList = ({ ref, className, children, onAddRequested, onDeleteRequested }) => {
    return (
        <HBoxPanel gap='0px'
                   ref={ref}
                   className={`${className} ${css.cringe} panel`}>
            <VBoxPanel className={`h-full y-scroll`}
                       gap='10px'>
                
            </VBoxPanel>
            <VDivider className={`v-full`}/>
            <VBoxPanel gap='10px' valign='start'>
                <ExButton className={`textbutton`}><Add className='icon-m'/> Добавить</ExButton>
                <ExButton className={`textbutton ${css.clear}`} gap='10px'><Bin className='icon-s'/> Очистить</ExButton>
            </VBoxPanel>
        </HBoxPanel>
    );
};