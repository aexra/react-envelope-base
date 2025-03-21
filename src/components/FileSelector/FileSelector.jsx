import { useState } from 'react';
import toast from 'react-hot-toast';
import css from './FileSelector.module.css';

const FileSelector = ({ files, setFiles, onFilesSelected, levelMapper }) => {
    const getLevel = () => {
        return Math.floor(Math.random() * 5) + 1;
    }
    
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const filesWithLevels = selectedFiles.map((file) => ({
            file,
            readLevel: getLevel(), // Случайный уровень доступа для чтения (1-3)
            writeLevel: getLevel(), // Случайный уровень доступа для записи (1-3)
        }));
        setFiles(filesWithLevels);
        onFilesSelected(filesWithLevels);
    };

    return (
        <div className={css.fileSelector}>
            <input type="file" multiple onChange={handleFileChange} />
            {files.length > 0 && (
                <ul>
                    {files.map((fileData, index) => (
                        <li key={index}>
                            {fileData.file.name} (Чтение: {fileData.readLevel}, Запись: {fileData.writeLevel})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileSelector;