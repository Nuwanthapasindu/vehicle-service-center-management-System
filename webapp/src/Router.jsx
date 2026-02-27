import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
             {/* TODO: ADD OTHER ROUTES */}
             {/* DEFAULT ROUTE 404 ROUTE */}
             <Route path="*" element={<h1>404</h1>} />
        </Routes>
    );
}

export default Router;