import { Box, Divider, Inline } from '@stripe/ui-extension-sdk/ui'
import { PricingTable, PricingTableProduct } from '../types'
import PricingTableProductCardFeatures from './PricingTableProductCardFeatures'

const PricingTableProductCard = ({
  pricingTable,
  product,
}: {
  pricingTable: PricingTable
  product: PricingTableProduct
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
            <Inline>
              {(product.monthly_stripe_price.unit_amount || 0) / 100}{' '}
              {product.monthly_stripe_price.currency} / mo
            </Inline>
          )}
          {pricingTable.annual_enabled && product.annual_stripe_price && (
            <Inline>
              {(product.annual_stripe_price.unit_amount || 0) / 100}{' '}
              {product.annual_stripe_price.currency} / yr
            </Inline>
          )}
        </Box>
      </Box>
      <Divider />
      <PricingTableProductCardFeatures product={product} />
    </Box>
  )
}

export default PricingTableProductCard
