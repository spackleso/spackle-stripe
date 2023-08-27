import { Box, Divider, Inline } from '@stripe/ui-extension-sdk/ui'
import { PricingTable, PricingTableProduct } from '../types'
import PricingTableProductCardFeatures from './PricingTableProductCardFeatures'
import { stripePriceDisplay } from '../utils'

const PricingTableProductCard = ({
  pricingTable,
  product,
}: {
  pricingTable: PricingTable
  product: PricingTableProduct
  isEditable?: boolean
}) => {
  return (
    <Box
      key={product.id}
      css={{
        stack: 'y',
        distribute: 'space-between',
        padding: 'large',
        marginY: 'small',
        alignY: 'center',
        gapY: 'small',
        background: 'container',
        borderRadius: 'medium',
      }}
    >
      <Box css={{ stack: 'x', gapX: 'small' }}>
        <Box css={{ fontWeight: 'bold' }}>{product.name}</Box>
        <Box css={{ stack: 'x', alignX: 'end', gapX: 'medium' }}>
          {pricingTable.monthly_enabled && product.monthly_stripe_price && (
            <Inline>{stripePriceDisplay(product.monthly_stripe_price)}</Inline>
          )}
          {pricingTable.annual_enabled && product.annual_stripe_price && (
            <Inline>{stripePriceDisplay(product.annual_stripe_price)}</Inline>
          )}
        </Box>
      </Box>
      <Divider />
      <PricingTableProductCardFeatures product={product} />
    </Box>
  )
}

export default PricingTableProductCard
