import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

// Static Import
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import Loading from './components/Loading'


// Importing Components using lazy loading
const Home = lazy(() => import('./pages/Home'))
const AllProducts = lazy(() => import('./pages/AllProducts'))
const ProductCategory = lazy(() => import('./pages/ProductCategory'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const AddAddress = lazy(() => import('./pages/AddAddress'))
const MyOrders = lazy(() => import('./pages/MyOrders'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const SellerLayout = lazy(() => import('./pages/seller/SellerLayout'))
const AddProduct = lazy(() => import('./pages/seller/AddProduct'))
const Orders = lazy(() => import('./pages/seller/Orders'))
const ProductList = lazy(() => import('./pages/seller/ProductList'))
const SellerLogin = lazy(() => import('./components/seller/SellerLogin'))


const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>

      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      <main className={isSellerPath ? "" : `px-6 md:px-16 lg:px-24 xl:px-32`}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<AllProducts />} />
            <Route path='/products/:category' element={<ProductCategory />} />
            <Route path='/products/:category/:id' element={<ProductDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/add-address' element={<AddAddress />} />
            <Route path='/my-orders' element={<MyOrders />} />
            <Route path='/loader' element={<Loading />} />
            <Route path='/reset-password' element={<ResetPassword />} />

            <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
              <Route index element={isSeller ? <AddProduct /> : null} />
              <Route path='product-list' element={<ProductList />} />
              <Route path='orders' element={<Orders />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App
