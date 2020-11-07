import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import About from './pages/About/About.js';
import Contact from './pages/Contact/Contact.js';
import SignIn from './pages/SignIn/SignIn.js';
import SignUp from './pages/SignUp/SignUp.js';
import OrderContext from './utils/Contexts/OrderContext.js';
import UserContext from './utils/Contexts/UserContext.js';
import API from './utils/API.js';
import AdminRA from './pages/Admin/Admin-ra.js';
import Home from '../src/pages/Home/Home.js';
import Preorder from './pages/Preorder/Preorder.js';
import Profile from './pages/Profile/Profile.js';
import OrderHistory from './pages/OrderHistory/OrderHistory.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css';

const App = () => {
  const [orderState, setOrderState] = useState({
    orders: []
  });

  // when componentDidMount, get orders from localStorage
  useEffect(() => {
    const ordersFromLocal = JSON.parse(localStorage.getItem('orders'));
    if (ordersFromLocal) {
      setOrderState(ordersFromLocal);
    }
  }, []);

  // when Add to cart is clicked, then setOrderState to push new order to orders array
  const onClick = (title, quantity, price) => {
    // console.log(Math.sign(quantity));
    const testNegative = Math.sign(quantity);
    if (quantity !== '0' && testNegative !== -1 ) {
      const orders = [...orderState.orders, { title, quantity, price }];
    localStorage.setItem('orders', JSON.stringify({ ...orderState, orders }));
    setOrderState({ ...orderState, orders });
    } else {
      alert('Quantity cannot be 0 or nagative')
    }
  }

  const onDelete = i => {
    const copyState = [...orderState.orders];
    copyState.splice(i, 1);
    setOrderState({ orders: copyState });
    localStorage.setItem('orders', JSON.stringify({ orders: copyState }));
  }

  const [customerDetails, setCustomerDetails] = useState();

  if (customerDetails) {
    const customerDetailsCopy = customerDetails
    localStorage.setItem('user', JSON.stringify(customerDetailsCopy));
  }

  // when componentDidMount, get user from localStorage
  useEffect(() => {
    const userFromLocal = JSON.parse(localStorage.getItem('user'));
    if (userFromLocal) {
      setCustomerDetails(userFromLocal);
    }
  }, []);

  // use when order has been placed
  const resetOrder = () => {
    localStorage.removeItem('orders');
    setOrderState({ orders: [] });
  };

  // need to use api to send order to backend
  const placeOrder = () => {
    // console.log('send order to backend');
    // console.log(orderState.orders.title);
    // console.log(customerDetails['username']);
    if (customerDetails === undefined) {
      alert('please log in before placing an order');
      return;
    } else {
      API.sendOrderToBackend({
        orders: orderState.orders,
        username: customerDetails['username']
      })
      resetOrder();
      alert('Thank you for shopping with us');
    }
  };

  return (
    <UserContext.Provider value={[customerDetails, setCustomerDetails]}>
      <OrderContext.Provider value={{ orders: orderState.orders, onClick, onDelete, placeOrder }}>
        <Router>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/about' component={About} />
              <Route exact path='/preorder' component={Preorder} />
              <Route exact path='/contact' component={Contact} />
              <Route exact path='/signin' component={SignIn} />
              <Route exact path='/signup' component={SignUp} />
              <Route exact path='/profile' component={Profile} />
              <Route exact path='/orderHistory' component={OrderHistory} />
              <Route exact path='/admin' component={AdminRA} />
            </Switch>
        </Router>
      </OrderContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
