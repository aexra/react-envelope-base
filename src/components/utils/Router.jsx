import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SamplesPage } from '../../react-envelope/components/pages/SamplesPage/SamplesPage';
import { PrivateRoute } from "../../react-envelope/utils/PrivateRoute";
import { DevExpPage } from "../../react-envelope/components/pages/development/DevExpPage/DevExpPage";
import { UserSettingsPage } from "../../react-envelope/components/pages/UserSettingsPage/UserSettingsPage";
import { Lab5 } from "../pages/Lab5/Lab5";
import { Lab6 } from "../pages/Lab6/Lab6";
import { useEffect } from "react";
import { useNavigation } from "../../react-envelope/hooks/useNavigation";
import { Code, ExperimentOutlined, Package, Pizza } from "../../react-envelope/components/dummies/Icons";
import { DocsPage } from "../../react-envelope/components/pages/development/DocsPage/DocsPage";
import { ScrollRestoration } from "../../react-envelope/utils/ScrollRestoration";
import { AuthPage } from "../pages/user/AuthPage/AuthPage";
import { Lab8 } from "../pages/Lab8/Lab8";

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
            name: 'Лабораторная работа №5',
            to: '/lab/5',
            props: {
                icon: <ExperimentOutlined/>,
            }
        }, {
            name: 'Лабораторная работа №6',
            to: '/lab/6',
            props: {
                icon: <ExperimentOutlined/>,
            }
        }, {
            name: 'Лабораторная работа №8',
            to: '/lab/8',
            props: {
                icon: <ExperimentOutlined/>,
            }
        }, {
            name: 'Экспериментальная',
            to: '/_lab/exp',
            // permissions: 'dev',
            props: {
                icon: <Code/>,
                className: 'debug'
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

                <Route path="/user">
                    <Route path="auth" element={<AuthPage/>}/>

                    <Route element={<PrivateRoute/>}>
                        <Route path="settings" element={<UserSettingsPage/>}/>
                    </Route>
                </Route>

                <Route path="/profile/:tag" element={'User profile'}/>

                <Route path="/lab">
                    <Route path="5" element={<Lab5/>}/>
                    <Route path="6" element={<Lab6/>}/>
                    <Route path="8" element={<Lab8/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};