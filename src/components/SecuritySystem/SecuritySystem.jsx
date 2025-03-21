import { useState } from 'react';
import toast from 'react-hot-toast';
import UserIdentification from '../UserIdentification/UserIdentification';
import ObjectAccess from '../ObjectAccess/ObjectAccess';
import css from './SecuritySystem.module.css';
import FileSelector from '../FileSelector/FileSelector';

const SecuritySystem = ({currentUser, setCurrentUser, files, setFiles, fileContents, setFileContents, users, levelMapper}) => {
    const handleLogin = (user) => {
        setCurrentUser(user);
    };

    const handleQuit = () => {
        toast(`Работа пользователя ${currentUser.name} завершена. До свидания.`);
        setCurrentUser(null);
    };

    const handleFileContentUpdate = (fileName, content) => {
        setFileContents((prev) => ({
            ...prev,
            [fileName]: content,
        }));
    };

    return (
        <div className={'flex col g10'}>
            {!currentUser ? (
                <>
                    <UserIdentification users={users} onLogin={handleLogin} />
                    <FileSelector onFilesSelected={setFiles} files={files} setFiles={setFiles} />
                </>
            ) : (
                <ObjectAccess
                    user={currentUser}
                    files={files}
                    fileContents={fileContents}
                    onFileContentUpdate={handleFileContentUpdate}
                    onQuit={handleQuit}
                    levelMapper={levelMapper}
                />
            )}
        </div>
    );
};

export default SecuritySystem;