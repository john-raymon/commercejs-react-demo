import React from 'react'

function LineItem({ id, name, quantity, removeProductFromCart }) {
  return (
    <div className="cart-container__line-item w-100 flex items-center justify-between pb2">
      <div className="w-auto pr1">
        <p className="tracked ttc f7">
          {name} - ({quantity})
        </p>
      </div>
      <button className="dim b1 b--mid-gray outline-0 pointer pa2" onClick={() => removeProductFromCart(id)}>
        Remove from Cart
      </button>
    </div>
  )
}

export default LineItem;
