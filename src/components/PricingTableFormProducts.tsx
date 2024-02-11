import { Box } from '@stripe/ui-extension-sdk/ui'
import PricingTablesProductList from './PricingTablesProductList'
import PricingTableAddProductForm from './PricingTableProductCreateForm'
import {
  NewPricingTableProduct,
  PricingTable,
  PricingTableProduct,
} from '../types'

type PricingTableFormProductsProps = {
  error: Error | undefined
  pricingTable: PricingTable
  pricingTableProducts: (PricingTableProduct | NewPricingTableProduct)[]
  setPricingTableProducts: (
    products: (PricingTableProduct | NewPricingTableProduct)[],
  ) => void
}

const PricingTableFormProducts = ({
  error,
  pricingTable,
  pricingTableProducts,
  setPricingTableProducts,
}: PricingTableFormProductsProps) => {
  return (
    <Box>
      <Box css={{ font: 'heading' }}>Products</Box>
      <Box
        css={{
          font: 'caption',
          color: 'secondary',
          marginBottom: 'medium',
        }}
      >
        These are the products that will be displayed in your pricing table with
        their associated features. Example: Basic, Premium, Pro
      </Box>

      {error?.message && (
        <Box
          css={{
            color: 'critical',
            fontWeight: 'semibold',
            textAlign: 'center',
          }}
        >
          {error.message}
        </Box>
      )}

      <PricingTablesProductList
        pricingTable={pricingTable}
        pricingTableProducts={pricingTableProducts}
        isEditable={true}
        setPricingTableProducts={setPricingTableProducts}
      />
      <PricingTableAddProductForm
        monthlyEnabled={pricingTable.monthly_enabled}
        annualEnabled={pricingTable.annual_enabled}
        pricingTableProducts={pricingTableProducts}
        setPricingTableProducts={setPricingTableProducts}
      />
    </Box>
  )
}

export default PricingTableFormProducts
