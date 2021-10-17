import './App.css';
import Home from './pages/home/home';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Contact from './pages/contact/contact';
import Introduce from './pages/introduce/introduce';
import Login from './pages/login/login';
import NotFoundPage from './pages/notFound/notFound';
import Register from './pages/register/regiter'
import ProductDetail from './pages/productDetail/productDetail';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/contact' exact component={Contact} />
        <Route path='/introduce' exact component={Introduce} />
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <Route path='/product/:id' exact component={ProductDetail} />
        <Route component={NotFoundPage} />     
      </Switch>
    </BrowserRouter>
  );
}

export default App;

