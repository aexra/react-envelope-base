import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SamplesPage } from '../../react-envelope/components/pages/SamplesPage/SamplesPage';
import { AuthPage } from '../../react-envelope/components/pages/AuthPage/AuthPage';

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SamplesPage/>}/>
                <Route path="/login" element={<AuthPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};