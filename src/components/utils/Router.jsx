import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SamplesPage } from '../../react-envelope/components/pages/SamplesPage/SamplesPage';
import { AuthPage } from '../../react-envelope/components/pages/AuthPage/AuthPage';
import { PrivateRoute } from "../../react-envelope/utils/PrivateRoute";
import { DevExpPage } from "../../react-envelope/components/pages/DevExpPage/DevExpPage";
import { UserSettingsPage } from "../../react-envelope/components/pages/UserSettingsPage/UserSettingsPage";

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SamplesPage/>}/>
                <Route path="/login" element={<AuthPage/>}/>

                <Route element={<PrivateRoute roles='dev'/>}>
                    <Route path="/_lab" element={<DevExpPage/>}/>
                </Route>

                <Route path="/profile" element={<PrivateRoute/>}>
                    <Route path="settings" element={<UserSettingsPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};