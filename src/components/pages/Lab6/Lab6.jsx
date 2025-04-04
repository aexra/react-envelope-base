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
import bonk from '../../../assets/bonk.png';
import HBoxPanel from "../../../react-envelope/components/layouts/HBoxPanel/HBoxPanel";

export const Lab6 = () => {
    const eps = 50;
    const {
        user,
        users,
        isLoading,
        lock,
        attempts,
        register,
        login,
        logout,
        lockUser, 
        countAttempt, 
        resetAttempts,
    } = useBiometryAuth();

    const [name, setName] = useState("");
    const [phrase, setPhrase] = useState("");
    const [currentInterval, setCurrentInterval] = useState(0);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        setCurrentInterval(0);
        setPhrase('');
        setName('');
    }, [isRegisterMode]);

    const handleBadLogin = () => {
        countAttempt();
    };

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
                    handleBadLogin();
                    logout();
                }
            } else {
                toast.error("Неверные данные");
            }
        }
    };

    useEffect(() => {
        if (attempts > 2 && lock == 0) {
            setIsLocked(true);
            lockUser(10);
            resetAttempts();
        }
    }, [attempts]);

    useEffect(() => {
        if (!lock || lock == 0) {
            setIsLocked(false);
        }
        if (lock && lock > 0) {
            setIsLocked(true);
        }
    }, [lock]);

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <PageBase>
            <Headline>Биометрическая аутентификация</Headline>

            <div className={css.modal}>
                {isLocked && <div className={`${css.lock} flex col center g10`}>
                    <h1 className={css.title}>Ты в бане!</h1>
                    <img src={bonk} className={css.bonk}/>
                    <HBoxPanel gap={'10px'}>
                        <h1 className={css.remainTitle}>Осталось: </h1>
                        <h1 className={css.remainCounter}>{lock}</h1>
                    </HBoxPanel>
                </div>}
                {user ? (
                    <div>
                        <h2>Добро пожаловать, {user.name}!</h2>
                        <p>Ваш средний интервал: {user.interval} мс</p>
                        <p>Текущий интервал: {currentInterval} мс</p>
                        <p>Разница: {Math.abs(user.interval - currentInterval)} мс</p>

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