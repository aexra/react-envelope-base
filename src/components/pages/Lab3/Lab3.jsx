import { useState } from 'react';
import { ExperimentOutlined } from '../../../react-envelope/components/dummies/Icons';
import { HeaderTitle } from '../../../react-envelope/components/dummies/styleless/HeaderTitle';
import BasePage from '../../../react-envelope/components/pages/BasePage/BasePage';
import DSTUFooter from '../../../react-envelope/components/widgets/DSTUFooter/DSTUFooter';
import DSTUNavSidebar from '../../../react-envelope/components/widgets/DSTUNavSidebar/DSTUNavSidebar';
import SecuritySystem from '../../SecuritySystem/SecuritySystem';
import css from './Lab3.module.css';

export const Lab3 = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [files, setFiles] = useState([]);
    const [fileContents, setFileContents] = useState({}); // Храним содержимое файлов
    const [users] = useState([
        {
            name: 'Ivan',
            readLevel: 5,
            writeLevel: 5,
        },
        {
            name: 'Anton',
            readLevel: 3,
            writeLevel: 3,
        },
        {
            name: 'Boris',
            readLevel: 0,
            writeLevel: 0,
        }
    ]);
    
    return (
        <BasePage
            headerContent={<HeaderTitle text='ENVELOPE' icon={<ExperimentOutlined />} />}
            bodyClassName={`h-full`}
            footerContent={<DSTUFooter />}
            navSidebar={<DSTUNavSidebar />}
            bodyGap='10px'
        >
            <SecuritySystem currentUser={currentUser}
                            setCurrentUser={setCurrentUser}
                            files={files}
                            setFiles={setFiles}
                            fileContents={fileContents}
                            setFileContents={setFileContents}
                            users={users}/>
        </BasePage>
    );
};