import React, { Component } from 'react'

class Checkout extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {
    const {
      captureOrder
    } = this.props
    const {
      state
    } = this.state
    return (
      <div className="checkout-container mw7 center pb4">
        <h2 className="tracked ttu gray flex justify-between">
          Checkout
        </h2>
        <form onSubmit={captureOrder}>
          {
          // in real-world app it is best practice to check conditionals
          // in order to know what information to collect
          }
          <h4 className="tracked ttu gray flex justify-between">
            Customer Details
          </h4>

          <h4 className="tracked ttu gray flex justify-between">
            Shipping Address
          </h4>

          <h4 className="tracked ttu gray flex justify-between">
            Shipping Method
          </h4>

          <button className='dim b1  b--mid-gray outline-0 pointer pa2 mt2 db w-100 ttc'>
            complete order
          </button>
        </form>
      </div>
    )
  }
}


export default Checkout
