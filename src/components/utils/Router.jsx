import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SamplesPage } from '../../react-envelope/components/pages/SamplesPage/SamplesPage';

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SamplesPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};