import { useEffect, useState } from "react";
import { HeaderTitle } from "../../../react-envelope/components/dummies/styleless/HeaderTitle";
import { PageBase } from "../../../react-envelope/components/pages/base/PageBase/PageBase";
import { SuperTextBox } from "../../ui/input/SuperTextBox/SuperTextBox";
import toast from "react-hot-toast";
import { useBiometryAuth } from "../../../hooks/useBiometryAuth";
import ExButton from "../../../react-envelope/components/ui/buttons/ExButton/ExButton";
import ExTextBox from "../../../react-envelope/components/ui/input/text/ExTextBox/ExTextBox";
import { Headline } from "../../../react-envelope/components/ui/labels/Headline/Headline";
import css from './a.module.css';

export const Lab6 = () => {
    const eps = 50;
    const {
        currentUser,
        register,
        login,
        logout,
        isLoading
    } = useBiometryAuth();

    const [name, setName] = useState("");
    const [phrase, setPhrase] = useState("");
    const [currentInterval, setCurrentInterval] = useState(0);
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    useEffect(() => {
        setCurrentInterval(0);
        setPhrase('');
        setName('');
    }, [isRegisterMode]);

    const handleSpeedChange = ({ avi }) => {
        setCurrentInterval(avi);
    };

    const handleAuthAction = () => {
        if (!name.trim() || !phrase.trim()) {
            toast.error("Заполните все поля");
            return;
        }

        if (isRegisterMode) {
            const result = register(name, phrase, currentInterval);
            if (result) {
                toast.success("Регистрация успешна!");
                setIsRegisterMode(false);
            } else {
                toast.error("Пользователь уже существует");
            }
        } else {
            const result = login(name, phrase);
            if (result) {
                if (Math.abs(result.interval - currentInterval) <= eps) {
                    toast.success("Вход выполнен!");
                } else {
                    toast.error("Несоответствие биометрических параметров");
                    logout();
                }
            } else {
                toast.error("Неверные данные");
            }
        }
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <PageBase>
            <Headline>Биометрическая аутентификация</Headline>

            <div className={css.modal}>
                {currentUser ? (
                    <div>
                        <h2>Добро пожаловать, {currentUser.name}!</h2>
                        <p>Ваш средний интервал: {currentUser.interval} мс</p>
                        <p>Текущий интервал: {currentInterval} мс</p>
                        <p>Разница: {Math.abs(currentUser.interval - currentInterval)} мс</p>

                        <ExButton
                            onClick={logout}
                            style={{ marginTop: "20px" }}
                        >
                            Выйти
                        </ExButton>
                    </div>
                ) : (
                    <div>
                        <h2>{isRegisterMode ? "Регистрация" : "Вход"}</h2>

                        <div style={{ marginBottom: "15px" }}>
                            <ExTextBox
                                text={name}
                                textChanged={(e) => setName(e)}
                                hint={'Имя пользователя'}
                                placeholder={'Введите имя'}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <SuperTextBox
                                hint="Контрольная фраза"
                                placeholder="Введите фразу"
                                details
                                value={phrase}
                                setValue={setPhrase}
                                limit={20}
                                strictLimit
                                onSpeedChange={handleSpeedChange}
                            />
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                            <ExButton
                                onClick={handleAuthAction}
                                primary
                                className={'accent-button flex-1'}
                            >
                                {isRegisterMode ? "Зарегистрироваться" : "Войти"}
                            </ExButton>

                            <ExButton
                                onClick={() => setIsRegisterMode(!isRegisterMode)}
                            >
                                {isRegisterMode ? "Уже есть аккаунт?" : "Нет аккаунта?"}
                            </ExButton>
                        </div>
                    </div>
                )}
            </div>
        </PageBase>
    );
};