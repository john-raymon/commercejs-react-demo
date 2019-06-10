import React from 'react'

function CheckoutLineItem({ id, product_name:name, quantity, line_total:subtotal }) {
  return (
    <div className="cart-container__line-item w-100 flex items-center justify-between pb2">
      <div className="w-auto pr1">
        <p className="tracked ttc f7">
          {name} - ({quantity})
        </p>
      </div>
      <p className="pa0 ma0">
        ${subtotal.formatted_with_code}
      </p>
    </div>
  )
}

export default CheckoutLineItem;
