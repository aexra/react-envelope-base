import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SamplesPage } from '../../react-envelope/components/pages/SamplesPage/SamplesPage';
import { PrivateRoute } from "../../react-envelope/utils/PrivateRoute";
import { DevExpPage } from "../../react-envelope/components/pages/development/DevExpPage/DevExpPage";
import { UserSettingsPage } from "../../react-envelope/components/pages/UserSettingsPage/UserSettingsPage";
import { useEffect } from "react";
import { useNavigation } from "../../react-envelope/hooks/useNavigation";
import { Code, ExperimentOutlined, Package, Pizza } from "../../react-envelope/components/dummies/Icons";
import Styles from '../../App.css';
import { Lab3 } from "../pages/Lab3/Lab3";
import { Lab4 } from "../pages/Lab4/Lab4";
import { Lab6 } from "../pages/Lab6/Lab6";
import { DocsPage } from "../../react-envelope/components/pages/development/DocsPage/DocsPage";
import { ScrollRestoration } from "../../react-envelope/utils/ScrollRestoration";
import { AuthPage } from "../pages/user/AuthPage/AuthPage";

export const Router = () => {
    const { routes, add } = useNavigation();

    useEffect(() => {
        add({
            name: 'ENVELOPE 2.0',
            to: '/',
            props: {
                icon: <Package/>
            }
        }, {
            name: 'ENVELOPE',
            to: '/_lab/old',
            props: {
                icon: <Pizza/>
            }
        }, {
            name: 'Экспериментальная',
            to: '/_lab/exp',
            // permissions: 'dev',
            props: {
                icon: <Code/>,
                className: 'debug'
            }
        }, {
            name: 'Лабораторная работа №3',
            to: '/lab/3',
            // requireAuth: true,
            props: {
                icon: <ExperimentOutlined/>
            }
        }, {
            name: 'Лабораторная работа №5',
            to: '/lab/4',
            // requireAuth: true,
            props: {
                icon: <ExperimentOutlined/>
            }
        }, {
            name: 'Лабораторная работа №6',
            to: '/lab/6',
            // requireAuth: true,
            props: {
                icon: <ExperimentOutlined/>
            }
        });
    }, [])

    return (
        <BrowserRouter>
            <ScrollRestoration/>
            <Routes>
                <Route path="/" element={<DocsPage/>}/>

                <Route path="/_lab">
                    <Route path="old" element={<SamplesPage/>}/>
                    <Route path="exp" element={<DevExpPage/>}/>
                </Route>

                <Route path="/lab">
                    <Route path="3" element={<Lab3/>}/>
                    <Route path="4" element={<Lab4/>}/>
                    <Route path="6" element={<Lab6/>}/>
                </Route>

                <Route path="/user">
                    <Route path="auth" element={<AuthPage/>}/>

                    <Route element={<PrivateRoute/>}>
                        <Route path="settings" element={<UserSettingsPage/>}/>
                    </Route>
                </Route>

                <Route path="/profile/:tag" element={'User profile'}/>
            </Routes>
        </BrowserRouter>
    );
};