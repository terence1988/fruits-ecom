/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import OrderContext from '../../utils/Contexts/OrderContext';
import OrderModalContext from '../../utils/Contexts/OrderModalContext';
import customerNavbarItems from '../../utils/Data/customerNavbaritems';
import Footer from '../../components/Footer/Footer';
import Navigation from '../../components/Navigation/Navigation';
import WarningModal from '../../components/Modal/WarningModal';
import './Checkout.css';

const Checkout = () => {
    const useStyles = makeStyles(theme => ({
        appBar: {
            position: 'relative'
        },
        layout: {
            width: 'auto',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
                width: 600,
                marginLeft: 'auto',
                marginRight: 'auto'
            }
        },
        paper: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
            padding: theme.spacing(2),
            [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
                marginTop: theme.spacing(6),
                marginBottom: theme.spacing(6),
                padding: theme.spacing(3)
            }
        },
        stepper: {
            padding: theme.spacing(3, 0, 5)
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        button: {
            marginTop: theme.spacing(3),
            marginLeft: theme.spacing(1)
        },
        listItem: {
            padding: theme.spacing(1, 0)
        },
        title: {
            marginTop: theme.spacing(2)
        }
    }));

    const classes = useStyles();
    const orderState = useContext(OrderContext);
    // total is the total price of the order
    const [total, setTotal] = useState(0);
    const orderModalState = useContext(OrderModalContext);

    // only setTotal when orderState changes to avoid infinite re-render
    useEffect(() => {
        const array = [];
        if (orderState.orders) {
            orderState.orders.forEach(item => {
                const totalPrice = item.quantity * item.price;
                array.push(totalPrice);
            });
        }

        if (typeof array !== 'undefined' && array.length > 0) {
            const totalPrice = array.reduce((a, b) => a + b);
            setTotal(totalPrice);
        }
    }, [orderState]);

    // this maps the items in the order
    const mapOrderItems = orderState.orders.map((item, i) => {
        const totalPrice = item.quantity * item.price;

        return (
            <ListItem className={classes.listItem} key={i} >
                <ListItemText primary={item.title} secondary={`Quantity: ${item.quantity}       Price/unit: $${item.price}`} />
                <Typography variant="body2">{`$${totalPrice}`} </Typography>
            </ListItem>
        );
    });

    return (
        <>
            <Navigation items={customerNavbarItems} />
            <Container className='checkoutContainer'>
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Checkout
                        </Typography>
                        {/* Review section */}
                        <>
                            <Typography variant="h6" gutterBottom>
                                Order summary
                            </Typography>
                            <List disablePadding>
                                {mapOrderItems}
                                <ListItem className={classes.listItem}>
                                    <ListItemText primary="Total" />
                                    {/* if no order, total amount is $0 */}
                                    {orderState.orders[0]
                                        ? <Typography variant="subtitle1" className={classes.total}>
                                            {`$${total}`}
                                        </Typography>
                                        : <Typography variant="subtitle1" className={classes.total}>
                                            $0
                                        </Typography>
                                    }
                                </ListItem>
                            </List>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom className={classes.title}>
                                        Free Click & Collect
                                    </Typography>
                                    <Typography gutterBottom>Shop online and pick up in store</Typography>
                                    <Typography gutterBottom>We will email you to let you know as soon as your order is ready</Typography>
                                </Grid>
                                <Grid item container direction="column" xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom className={classes.title}>
                                        Payment method
                                    </Typography>
                                    <Grid container>
                                        <React.Fragment>
                                            <Grid item xs={12}>
                                                <Typography gutterBottom>Payment is accepted when you pick up your order in store</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography gutterBottom>Cash and Card payment accepted</Typography>
                                            </Grid>
                                        </React.Fragment>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                        {/* buttons section: checkout and continue shopping */}
                        <>
                            <div className={classes.buttons}>
                                {/* if no order, button changes from place order to continue shopping */}
                                {orderState.orders[0]
                                    ? <Button
                                        variant="contained"
                                        onClick={orderState.placeOrder}
                                        className={classes.button}
                                    >
                                        Place Order
                                    </Button>
                                    : <Button
                                        variant="contained"
                                        onClick={() => { window.location = '/'; }}
                                        className={classes.button}
                                    >
                                        Continue Shopping
                                    </Button>
                                }
                                <WarningModal
                                    open={orderModalState.open}
                                    onClose={orderModalState.handleClose}
                                />
                            </div>

                        </>
                    </Paper>
                </main>
            </Container>
            <Footer />
        </>
    );
};

export default Checkout;
