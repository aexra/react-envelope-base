import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SamplesPage } from '../../react-envelope/components/pages/SamplesPage/SamplesPage';
import { AuthPage } from '../../react-envelope/components/pages/AuthPage/AuthPage';
import { PrivateRoute } from "../../react-envelope/utils/PrivateRoute";
import { DevExpPage } from "../../react-envelope/components/pages/DevExpPage/DevExpPage";
import { UserSettingsPage } from "../../react-envelope/components/pages/UserSettingsPage/UserSettingsPage";
import { useEffect } from "react";
import { useNavigation } from "../../react-envelope/hooks/useNavigation";
import { Code, Package, Pizza } from "../../react-envelope/components/dummies/Icons";
import Styles from '../../App.css';
import { DocsPage } from "../../react-envelope/components/pages/development/DocsPage/DocsPage";

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
            name: 'ENVELOPE 2.0',
            to: '/_lab/new',
            props: {
                icon: <Package/>
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
            <Routes>
                <Route path="/" element={<SamplesPage/>}/>
                <Route path="/login" element={<AuthPage/>}/>

                <Route path="/_lab">
                    <Route path="new" element={<DocsPage/>}/>
                    <Route path="exp" element={<DevExpPage/>}/>
                </Route>

                <Route path="/profile" element={<PrivateRoute/>}>
                    <Route path="settings" element={<UserSettingsPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};