import React, {Suspense} from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import Header from "./Header";
import Footer from "./Footer";
import { UserProvider } from "./Account/UserContext";
import { CartProvider } from "./Store/CartContext";
const Home = React.lazy(() => import("./Home"));
const Account = React.lazy(() => import("./Account"));
const Store = React.lazy(() => import("./Store"));
const Blog = React.lazy(() => import("./Blog"));
const Admin = React.lazy(() => import("./Admin"));

const App = () => {
    return (
        <UserProvider>
            <CartProvider>
                <div className="d-flex flex-column min-vh-100">
                    <Header />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/">
                                <Route
                                    index
                                    element={
                                        <Suspense>
                                            <Home />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="account/*"
                                    element={
                                        <Suspense>
                                            <Account />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="store/*"
                                    element={
                                        <Suspense>
                                            <Store />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="blog/*"
                                    element={
                                        <Suspense>
                                            <Blog />
                                        </Suspense>
                                    }
                                />
                                <Route
                                    path="admin/*"
                                    element={
                                        <Suspense>
                                            <Admin />
                                        </Suspense>
                                    }
                                />
                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                    <Footer />
                </div>
            </CartProvider>
        </UserProvider>
    );
};

const domNode = document.getElementById("app");
const root = createRoot(domNode);
root.render(<App />);
