import { Box } from '@stripe/ui-extension-sdk/ui'
import {
  NewPricingTableProduct,
  PricingTable,
  PricingTableProduct,
} from '../types'
import PricingTableProductCard from './PricingTableProductCard'

const PricingTablesProductList = ({
  pricingTable,
  pricingTableProducts,
  isEditable,
  setPricingTableProducts,
}: {
  pricingTable: PricingTable
  pricingTableProducts: (PricingTableProduct | NewPricingTableProduct)[]
  isEditable?: boolean
  setPricingTableProducts: (
    val: (PricingTableProduct | NewPricingTableProduct)[],
  ) => void
}) => {
  if (pricingTable.monthly_enabled) {
    pricingTableProducts = pricingTableProducts.sort((a, b) => {
      if (!a.monthly_stripe_price || !a.monthly_stripe_price.unit_amount)
        return 1
      if (!b.monthly_stripe_price || !b.monthly_stripe_price.unit_amount)
        return -1
      return (
        a.monthly_stripe_price.unit_amount - b.monthly_stripe_price.unit_amount
      )
    })
  } else if (pricingTable.annual_enabled) {
    pricingTableProducts = pricingTableProducts.sort((a, b) => {
      if (!a.annual_stripe_price || !a.annual_stripe_price.unit_amount) return 1
      if (!b.annual_stripe_price || !b.annual_stripe_price.unit_amount)
        return -1
      return (
        a.annual_stripe_price.unit_amount - b.annual_stripe_price.unit_amount
      )
    })
  }

  return (
    <Box>
      {pricingTableProducts.map((product) => (
        <PricingTableProductCard
          key={
            Object.hasOwn(product, 'id')
              ? (product as PricingTableProduct).id
              : Math.random()
          }
          pricingTable={pricingTable}
          product={product}
          onDelete={
            isEditable
              ? () =>
                  setPricingTableProducts(
                    pricingTableProducts.filter((ptp) => ptp !== product),
                  )
              : undefined
          }
        />
      ))}
    </Box>
  )
}

export default PricingTablesProductList
