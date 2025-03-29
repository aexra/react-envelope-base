import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SamplesPage } from '../../react-envelope/components/pages/SamplesPage/SamplesPage';
import { AuthPage } from '../../react-envelope/components/pages/AuthPage/AuthPage';
import { PrivateRoute } from "../../react-envelope/utils/PrivateRoute";
import { DevExpPage } from "../../react-envelope/components/pages/DevExpPage/DevExpPage";
import { UserSettingsPage } from "../../react-envelope/components/pages/UserSettingsPage/UserSettingsPage";
import { useEffect } from "react";
import { useNavigation } from "../../react-envelope/hooks/useNavigation";
import { Code, Package, Pizza } from "../../react-envelope/components/dummies/Icons";
import { DocsPage } from "../../react-envelope/components/pages/development/DocsPage/DocsPage";
import { ScrollRestoration } from "../../react-envelope/utils/ScrollRestoration";

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
        });
    }, [])

    return (
        <BrowserRouter>
            <ScrollRestoration/>
            <Routes>
                <Route path="/" element={<DocsPage/>}/>
                <Route path="/login" element={<AuthPage/>}/>

                <Route path="/_lab">
                    <Route path="old" element={<SamplesPage/>}/>
                    <Route path="exp" element={<DevExpPage/>}/>
                </Route>

                <Route path="/profile" element={<PrivateRoute/>}>
                    <Route path="settings" element={<UserSettingsPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};