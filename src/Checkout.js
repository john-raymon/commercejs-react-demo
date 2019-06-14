import React, { Component } from 'react'

// components
import CheckoutLineItem from './CheckoutLineItem';

class Checkout extends Component {
  constructor(props) {
    super(props)
    this.captureOrder = this.captureOrder.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getAllCountries = this.getAllCountries.bind(this)
    this.getRegions = this.getRegions.bind(this)
    this.getShippingOptions = this.getShippingOptions.bind(this)
    this.state = {
      customerFirstName: '',
      customerLastName: '',
      customerEmail: '',
      country: 'US',
      shippingFullName: '',
      streetAddress: '',
      city: '',
      provinceRegionState: '',
      postalZipcode: '',
      shippingOption: '',
      shippingOptions: [],
      cardNumber: '4242 4242 4242 4242',
      expMonth: '01',
      expYear: '2021',
      ccv: '123',
      billingPostalZipcode: '32825',
      countries: {},
      subdivisions: {}
    }
  }
  componentDidMount() {
    this.getAllCountries()
    this.getRegions('US')
    this.getShippingOptions(this.props.checkout.id,'US')
  }
  getAllCountries() {
    this.props.commerce.Services.localeListCountries((resp) => {
      this.setState({
        countries: resp.countries
      })
    })
  }
  getRegions(countryCode) {
    this.props.commerce.Services.localeListSubdivisions(countryCode, (resp) => {
      this.setState({
        subdivisions: resp.subdivisions
      })
    })
  }
  getShippingOptions(checkoutId, country) {
    this.props.commerce.Checkout.getShippingOptions(checkoutId, { country }, (resp) => {
      if (!resp.error) {
        this.setState({
          shippingOptions: resp
        })
      } else {
        this.setState({
          shippingOptions: []
        })
      }
    })
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
    if (e.target.name === "country") {
      this.getRegions(e.target.value)
      this.getShippingOptions(this.props.checkout.id, e.target.value)
    }
  }
  captureOrder() {
    const lineItems = this.props.checkout.live.line_items.reduce((obj, lineItem) => {
      obj[lineItem.id] = {
        quantity: lineItem.quantity
      }
      return obj
    }, {})
    const newOrder = {
      line_items: lineItems,
      customer: {
        firstname: this.state.customerFirstName,
        lastname: this.state.customerLastName,
        email: this.state.customerEmail
      },
      shipping: {
        name: this.state.shippingFullName,
        country: this.state.country,
        street: this.state.streetAddress,
        town_city: this.state.city,
        county_state: this.state.provinceRegionState,
        postal_zip_code: this.state.postalZipcode
      },
      fulfillment: {
        shipping_method: this.state.shippingOption
      },
      payment: {
        gateway: "test_gateway",
        card: {
          number: this.state.cardNumber,
          expiry_month: this.state.expMonth,
          expiry_year: this.state.expYear,
          cvc: this.state.ccv,
          postal_zip_code: this.state.billingPostalZipcode
        }
      }
    }
    console.log('The order constructed', newOrder)
    this.props.captureOrder(this.props.checkout.id, newOrder)
  }
  render() {
    const {
      captureOrder,
      cancelCheckout,
      checkout
    } = this.props

    const {
      customerFirstName,
      customerLastName,
      customerEmail,
      country,
      countries,
      shippingFullName,
      streetAddress,
      city,
      provinceRegionState,
      subdivisions,
      postalZipcode,
      shippingOption,
      shippingOptions,
      cardNumber,
      expMonth,
      expYear,
      ccv,
      billingPostalZipcode
    } = this.state

    const {
      live : {
        line_items: lineItems,
        shipping,
        tax,
        total_due: totalDue
      }
    } = checkout

    const allLineItems = lineItems.map((item, key) => {
      return (
        <li key={key}>
          <CheckoutLineItem {...item} />
        </li>
      )
    })

    const allCountryOptions = Object.keys(countries).map((country, key) => {
      return (
        <option value={country} key={key}>
          { countries[country] }
        </option>
      )
    })

    const allSubdivisionsOptions = Object.keys(subdivisions).map((subdivision, key) => {
      return (
        <option value={subdivision} key={key}>
          { subdivisions[subdivision] }
        </option>
      )
    })

    const allShippingOptions = shippingOptions.map((option, key) => {
      return (
        <option value={option.id} key={key}>
          { `${option.description} - $${option.price.formatted_with_code}` }
        </option>
      )
    })

    const selectedShippingPrice = shippingOption ? shippingOptions.reduce((obj, option) => {
     obj[option.id] = option.price
     return obj
    }, {})[shippingOption].formatted_with_code : '----'

    return (
      <div className="checkout-container mw7 center pb4">
        <h2 className="tracked ttu gray flex justify-between">
          Checkout
        </h2>
        <ul className="w-100 list-reset ma0 pv0 ph4">
          { allLineItems }
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.captureOrder();
          }}
          onChange={this.handleChange}
        >
          {
          // in real-world app it is best to check conditionals
          // in order to know what information to collect for order
          }
          <h4 className="tracked ttu gray flex justify-between">
            Customer Details
          </h4>

          <input className="db mb1" type="text" name="customerFirstName" value={customerFirstName} placeholder="First Name" />

          <input className="db mb1" type="text" name="customerLastName" value={customerLastName} placeholder="Last Name" />

          <input className="db mb1" type="email" name="customerEmail" value={customerEmail} placeholder="Email" />

          <h4 className="tracked ttu gray flex justify-between">
            shipping address
          </h4>

          <input className="db mb1" type="text" name="shippingFullName" value={shippingFullName} placeholder="Name" />

          <input className="db mb1" type="text" name="streetAddress" value={streetAddress} placeholder="Street Address" />

          <input className="db mb1" type="text" name="city" value={city} placeholder="City" />

          <input className="db mb1" type="text" name="postalZipcode" value={postalZipcode} placeholder="Postal/Zip Code" />

          <select value={country} name="country" className="db mb2">
            <option value="" disabled>Country</option>
            { allCountryOptions }
          </select>

          <select value={provinceRegionState} name="provinceRegionState" className="db mb2">
            <option value="" disabled>Province/Region/State</option>
            { allSubdivisionsOptions }
          </select>

          <h4 className="tracked ttu gray flex justify-between">
            choose a shipping method
          </h4>

          {
            shippingOptions.length > 0 ?
            (
              <select value={shippingOption} name="shippingOption" className="db mb2">
                <option value="" disabled>Choose a shipping method</option>
                { allShippingOptions }
              </select>
            ) :
            (
              `There are no shipping options available for the selected country.`
            )
          }

          <h4 className="tracked ttu gray flex justify-between">
            Payment
          </h4>

          <input className="db mb1" type="text" name="cardNumber" value={cardNumber} placeholder="Card Number" />

          <input className="db mb1" type="text" name="expMonth" value={expMonth} placeholder="Exp Month" />

          <input className="db mb1" type="text" name="expYear" value={expYear} placeholder="Exp Year" />

          <input className="db mb1" type="text" name="ccv" value={ccv} placeholder="Security Code (CCV)" />

          <input className="db mb1" type="text" name="billingPostalZipcode" value={billingPostalZipcode} placeholder="Billing Postal/Zip Code" />

          <p>
           Shipping: {selectedShippingPrice}
          </p>
          <p>
           Tax: {tax.amount.formatted_with_code}
          </p>
          <p>
           Total: {totalDue.formatted_with_code}
          </p>
          <button disabled={(!shippingOptions.length)} className={`dim b1 ${!shippingOptions.length ? 'b--light-gray' : 'b--mid-gray'} outline-0 pointer pa2 mt2 db w-100 ttc`}>
            complete order
          </button>
        </form>
        <span className="db tracked ttu tc mv2">or</span>
        <button className='dim b1  b--mid-gray outline-0 pointer pa2 mt2 db w-100 ttc' onClick={cancelCheckout}>
          continue shopping
        </button>
      </div>
    )
  }
}


export default Checkout
