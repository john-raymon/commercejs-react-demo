import React from 'react'

function Product({
  id,
  is: {
    sold_out: soldOut
  },
  media: {
    source
  },
  name,
  price,
  addProductToCart
}) {
  return (
    <div className="products-container__product fl w-third pa1 flex flex-column justify-center">
      <div
         className="aspect-ratio aspect-ratio--5x8 bg-black-50"
         style={{
           backgroundRepeat: "no-repeat",
           backgroundPosition: "center",
           backgroundSize: "contain",
           backgroundImage: `url(${source})`
         }}
       />
      <p className="tracked f7 flex justify-between items-center">
        { name }
        <span>
        ${ price.formatted_with_code }
        </span>
      </p>
      <button className="dim b1 b--mid-gray outline-0 pointer pa2" disabled={soldOut} onClick={() => addProductToCart(id)}>
        { soldOut ? 'Sold Out' : 'Add to Cart'}
      </button>

    </div>
  )
}

export default Product
