import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SamplesPage } from '../../react-envelope/components/pages/SamplesPage/SamplesPage';
import { AuthPage } from '../../react-envelope/components/pages/AuthPage/AuthPage';
import { PrivateRoute } from "../../react-envelope/utils/PrivateRoute";
import { DevExpPage } from "../../react-envelope/components/pages/DevExpPage/DevExpPage";
import { UserSettingsPage } from "../../react-envelope/components/pages/UserSettingsPage/UserSettingsPage";
import { useEffect } from "react";
import { useNavigation } from "../../react-envelope/hooks/useNavigation";
import { Code, ExperimentOutlined, Pizza } from "../../react-envelope/components/dummies/Icons";
import Styles from '../../App.css';
import { Lab3 } from "../pages/Lab3/Lab3";

export const Router = () => {
    const { routes, add } = useNavigation();

    useEffect(() => {
        add({
            name: 'ENVELOPE',
            to: '/',
            props: {
                icon: <Pizza/>
            }
        }, {
            name: 'Экспериментальная',
            to: '/_lab',
            permissions: 'dev',
            props: {
                icon: <Code/>,
                className: 'debug'
            }
        }, {
            name: 'Лабораторная работа №3',
            to: '/lab/3',
            requireAuth: true,
            props: {
                icon: <ExperimentOutlined/>
            }
        });
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SamplesPage/>}/>
                <Route path="/login" element={<AuthPage/>}/>

                <Route element={<PrivateRoute roles='dev'/>}>
                    <Route path="/_lab" element={<DevExpPage/>}/>
                </Route>

                <Route path="/lab" element={<PrivateRoute/>}>
                    <Route path="3" element={<Lab3/>}/>
                </Route>

                <Route path="/profile" element={<PrivateRoute/>}>
                    <Route path="settings" element={<UserSettingsPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};