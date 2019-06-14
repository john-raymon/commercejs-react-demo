import React, { Component, Fragment } from 'react';

// components
import Product from './Product'
import Cart from './Cart'
import Checkout from './Checkout'

class App extends Component {
  constructor(props) {
    super(props)
    this.addProductToCart = this.addProductToCart.bind(this)
    this.removeProductFromCart = this.removeProductFromCart.bind(this)
    this.createCheckout = this.createCheckout.bind(this)
    this.cancelCheckout = this.cancelCheckout.bind(this)
    this.captureOrder = this.captureOrder.bind(this)
    this.refreshCart = this.refreshCart.bind(this)
    this.state = {
      products: [],
      cart: null,
      checkout: null,
      order: null,
    }
  }
  componentDidMount() {
    const {
      commerce
    } = this.props
    if (commerce !== undefined && typeof commerce !== 'undefined') {
      // invoke commerce products method to get all products
      commerce.Products.list(
        (resp) => {
          //Success
          this.setState({
            products: resp.data
          })
        },
        (error) => {
          // handle error properly in real-world
        }
      );

      window.addEventListener("Commercejs.Cart.Ready", function (e) {
        // invoke commerce cart method to retrieve cart in session
        commerce.Cart.retrieve((cart) => {
          if (!cart.error) {
            return this.setState({
              cart: cart
            })
          }
        });
      }.bind(this))

    }
  }
  // product methods
  addProductToCart(productId) {
    this.props.commerce.Cart.add({
      id: productId,
    }, (resp) => {
      // if successful update Cart
      if (!resp.error) {
        this.setState({
          cart: resp.cart
        })
      }
    });
  }
  // cart methods
  removeProductFromCart(lineItemId) {
    this.props.commerce.Cart.remove(lineItemId, (resp) => {
      // if successful update Cart
      if (!resp.error) {
        this.setState({
          cart: resp.cart
        })
      }
    });
  }
  refreshCart(){
    this.props.commerce.Cart.refresh((resp) => {
      // successful
    }, error => console.log(error))
  }
  // checkout methods
  createCheckout() {
    if (this.state.cart.total_items > 0) {
      this.props.commerce.Checkout
        .generateToken(this.state.cart.id, { type: 'cart' },
          (checkout) => {
            this.setState({
              checkout: checkout
            })
          },
          function(error) {
            console.log('Error:', error)
          })
    }
  }
  cancelCheckout() {
    this.setState({
      checkout: null
    })
  }
  captureOrder(checkoutId, order) {
    // upon successful capturing of order, refresh cart, and clear checkout state, then set order state
    this.props.commerce.Checkout
      .capture(checkoutId, order, (resp) => {
        this.refreshCart()
        this.setState({
          checkout: null,
          order: resp
        })
      }, (error) => console.log(error))
  }
  render() {
    const {
      products,
      cart,
      checkout,
      order
    } = this.state;
    const allProducts = products.map((product, key) => {
      if (product.active) {  // the item is active and isn't sold out so display it
        return (
          <Product {...product} addProductToCart={this.addProductToCart} key={key} />
        )
      }
    })
    return (
      <div className="App ph2 pv4">
        {
          order &&
          (<div className="mw7 center">
            <h2 className="tracked ttu green">
              Thank you for shopping!
            </h2>
            <h4 className="tracked ttu gray flex justify-between">
             Your order number is #{this.state.order.id}
            </h4>
          </div>)
        }
        {
          checkout &&
          (
            <Checkout checkout={checkout} commerce={this.props.commerce} captureOrder={this.captureOrder} cancelCheckout={this.cancelCheckout}/>
          )
        }

        {
          !checkout &&
          (
            <Fragment>
              <Cart
                cart={cart}
                createCheckout={this.createCheckout}
                removeProductFromCart={this.removeProductFromCart}
              />

              <div className="products-container mw7 center cf">
                <h2 className="tracked ttu gray">
                  All Products
                </h2>
                { allProducts.length ?
                  allProducts :
                  'There no products available right now'
                }
              </div>
            </Fragment>
          )
        }
      </div>
    );
  }
}

export default App;
