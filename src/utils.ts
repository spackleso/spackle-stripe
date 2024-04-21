import Stripe from 'stripe'
import { Feature } from './types'

export function sortFeatures(a: Feature, b: Feature): number {
  const nameA = a.name.toUpperCase() // ignore upper and lowercase
  const nameB = b.name.toUpperCase() // ignore upper and lowercase
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }

  // names must be equal
  return 0
}

// Source https://stackoverflow.com/questions/19373860/convert-currency-names-to-currency-symbol
const currencySymbols: { [key: string]: string } = {
  USD: '$', // US Dollar
  EUR: '€', // Euro
  CRC: '₡', // Costa Rican Colón
  GBP: '£', // British Pound Sterling
  ILS: '₪', // Israeli New Sheqel
  INR: '₹', // Indian Rupee
  JPY: '¥', // Japanese Yen
  KRW: '₩', // South Korean Won
  NGN: '₦', // Nigerian Naira
  PHP: '₱', // Philippine Peso
  PLN: 'zł', // Polish Zloty
  PYG: '₲', // Paraguayan Guarani
  THB: '฿', // Thai Baht
  UAH: '₴', // Ukrainian Hryvnia
  VND: '₫', // Vietnamese Dong
}

export function stripePriceDisplay(price: Stripe.Price): string {
  if (price.unit_amount === null || price.unit_amount === undefined) {
    return price.nickname || price.id
  }

  let display = ''

  const currency = price.currency.toUpperCase()
  if (currencySymbols[currency]) {
    display += currencySymbols[currency]
  }

  display += (price.unit_amount / 100).toFixed(2)

  if (price.currency !== 'usd') {
    display += ` ${price.currency.toUpperCase()}`
  }

  if (price.recurring) {
    display += '/'
    if (price.recurring.interval_count > 1) {
      display += `${price.recurring.interval_count} ${price.recurring.interval}s`
    } else {
      display += price.recurring.interval
    }
  }

  return display
}

export const toHumanQuantity = (quantity: number) => {
  if (typeof quantity !== 'number') {
    return quantity
  }
  return quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
