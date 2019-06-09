import React, { Component } from 'react';

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
    this.state = {
      products: [],
      cart: null,
      checkout: null
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
            return this.setState({
              cart: cart
            })
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
  createCheckout() {
    this.setState({
      checkout: true
    })
  }
  render() {
    const {
      products,
      cart,
      checkout
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
          checkout &&
          (
            <div>
              Checkout
            </div>
          )
        }
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
      </div>
    );
  }
}

export default App;
