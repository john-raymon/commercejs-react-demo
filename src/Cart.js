import React from 'react';

// components
import LineItem from './LineItem';

function Cart({ cart, removeProductFromCart }) {
  if (cart) {
    const {
      total_items: totalItems,
      subtotal,
      line_items: lineItems
    } = cart;

    const allLineItems = lineItems.map((item, key) => {
      return (
        <li key={key}>
          <LineItem {...item} removeProductFromCart={removeProductFromCart} />
        </li>
      )
    })
    return (
    <div className="cart-container mw7 center">
      <h2 className="tracked ttu gray flex justify-between">
        Cart ({totalItems})
        <span className="flex flex-column f7">
          <span>
            subtotal: ${subtotal.formatted_with_code}
          </span>
        </span>
      </h2>
        {(totalItems > 0) ?
        (
          <ul className="w-100 list-reset ma0 pv0 ph4">
            { allLineItems }
          </ul>
        ) :
        (
          <p className="f7 tracked">Your cart is empty</p>
        )}
    </div>
    )
  } else {
    return (
      <p>Loading Cart ...</p>
    )
  }
}

export default Cart;
