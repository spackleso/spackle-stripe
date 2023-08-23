import { Box } from '@stripe/ui-extension-sdk/ui'
import { PricingTable, PricingTableProduct } from '../types'
import PricingTableProductCard from './PricingTableProductCard'

const PricingTablesProductList = ({
  pricingTable,
  pricingTableProducts,
}: {
  pricingTable: PricingTable
  pricingTableProducts: PricingTableProduct[]
}) => {
  return (
    <Box>
      {pricingTableProducts.map((product) => (
        <PricingTableProductCard
          key={product.id}
          pricingTable={pricingTable}
          product={product}
        />
      ))}
    </Box>
  )
}

export default PricingTablesProductList
