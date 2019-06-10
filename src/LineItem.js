import React from 'react'

function LineItem({ id, name, quantity, removeProductFromCart, line_total:subtotal}) {
  return (
    <div className="cart-container__line-item w-100 flex items-center justify-between pb2">
      <div className="w-auto pr1">
        <p className="tracked ttc f7">
          {name} - ({quantity}) - ${subtotal.formatted_with_code}
        </p>
      </div>
      <button className="dim b1 b--mid-gray outline-0 pointer pa2" onClick={() => removeProductFromCart(id)}>
        Remove from Cart
      </button>
    </div>
  )
}

export default LineItem;
