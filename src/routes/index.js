import HomePage from "../pages/HomePage/HomePage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";

export const routes = [
    {
        path: "/",
        page: HomePage,
        isShowHeader: true
    },
    {
        path: "/products",
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: "/order",
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: "/my-order",
        page: MyOrderPage,
        isShowHeader: true
    },
    {
        path: "/details-order/:id",
        page: DetailsOrderPage,
        isShowHeader: true
    },
    {
        path: "/payment",
        page: PaymentPage,
        isShowHeader: true
    },
    {
        path: "/orderSuccess",
        page: OrderSuccess,
        isShowHeader: true
    },
    {
        path: "/product/:type",
        page: TypeProductPage,
        isShowHeader: true
    },
    {
        path: "/sign-in",
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: "/sign-up",
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: "/product-details/:id",
        page: ProductDetailPage,
        isShowHeader: true
    },
    {
        path: "/profile-user",
        page: ProfilePage,
        isShowHeader: true
    },
    {
        path: "/system/admin",
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: "*",
        page: NotFoundPage
    }
]