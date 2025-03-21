import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import css from './ObjectAccess.module.css';
import Console from '../Console/Console';
import { StatusTag } from '../../react-envelope/components/ui/labels/StatusTag/StatusTag';

const ObjectAccess = ({ user, files, fileContents, onFileContentUpdate, onQuit }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleRead = (fileData) => {
        if (user.readLevel >= fileData.readLevel) {
            const reader = new FileReader();
            reader.onload = () => {
                onFileContentUpdate(fileData.file.name, reader.result); // Обновляем содержимое файла
                toast.success(`Содержимое файла ${fileData.file.name}:\n${reader.result}`);
            };
            reader.readAsText(fileData.file);
        } else {
            toast.error('Отказ в выполнении операции. Недостаточно прав для чтения.');
        }
    };

    const handleWrite = (fileData) => {
        if (user.writeLevel <= fileData.readLevel) {
            const content = prompt('Введите текст для записи:');
            if (content) {
                onFileContentUpdate(fileData.file.name, content); // Обновляем содержимое файла

                // Создаем Blob и ссылку для скачивания
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileData.file.name; // Имя файла для скачивания
                link.click();
                URL.revokeObjectURL(url); // Освобождаем память

                toast.success(`Запись в файл ${fileData.file.name} выполнена успешно. Файл скачан.`);
            }
        } else {
            toast.error('Отказ в выполнении операции. Недостаточно прав для записи.');
        }
    };

    return (
        <div className={css.objectAccess}>
            <h3>Перечень доступных объектов:</h3>
            <ul>
                {files.map((fileData, index) => (  
                    (user.readLevel >=  fileData.readLevel || user.readLevel <=  fileData.readLevel) &&
                    <li key={index}>
                        <div className='flex row g10 pad5'>
                            <span>{fileData.file.name}</span>
                            {user.readLevel >=  fileData.readLevel && <StatusTag text={'Чтение'} type={'success'}/>}
                            {user.readLevel <=  fileData.readLevel && <StatusTag text={'Запись'} type={'info'}/>}
                        </div>
                        {user.readLevel >=  fileData.readLevel && <button onClick={() => handleRead(fileData)}>Читать</button>}
                        {user.readLevel <=  fileData.readLevel && <button onClick={() => handleWrite(fileData)}>Записать</button>}
                    </li>
                ))}
            </ul>
            {fileContents[selectedFile?.file.name] && (
                <div className={css.fileContent}>
                    <h4>Содержимое файла:</h4>
                    <pre>{fileContents[selectedFile?.file.name]}</pre>
                </div>
            )}
            <Console
                onCommand={(cmd) => {
                    if (cmd === 'quit') {
                        onQuit();
                    }
                }}
            />
        </div>
    );
};

export default ObjectAccess;