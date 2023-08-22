import { Box, Divider, Icon, Inline } from '@stripe/ui-extension-sdk/ui'
import { Feature, PricingTable, PricingTableProduct } from '../types'

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
        <Box
          key={product.id}
          css={{
            stack: 'y',
            distribute: 'space-between',
            padding: 'medium',
            marginY: 'small',
            alignY: 'center',
            gap: 'medium',
            background: 'container',
            borderRadius: 'medium',
          }}
        >
          <Box css={{ stack: 'y', gapY: 'small' }}>
            <Box css={{ fontWeight: 'bold' }}>{product.name}</Box>
            <Box>
              {pricingTable.monthly_enabled && product.monthly_stripe_price && (
                <Inline>
                  ${product.monthly_stripe_price.unit_amount || 0 / 100}/month{' '}
                </Inline>
              )}
              {pricingTable.annual_enabled && product.annual_stripe_price && (
                <Inline>
                  ${product.annual_stripe_price.unit_amount || 0 / 100}/month{' '}
                </Inline>
              )}
            </Box>
          </Box>
          <Divider />
          <Box css={{ stack: 'y', gapY: 'small' }}>
            {product.features.map((feature: Feature) => (
              <Box
                key={feature.id}
                css={{
                  stack: 'x',
                  gapX: 'medium',
                  alignY: 'center',
                  distribute: 'space-between',
                }}
              >
                <Box>{feature.name}</Box>
                <Box>
                  {feature.value_flag ? (
                    <Icon
                      name="check"
                      size="xsmall"
                      css={{ fill: 'success' }}
                    />
                  ) : (
                    <Icon
                      name="delete"
                      size="xsmall"
                      css={{ fill: 'critical' }}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default PricingTablesProductList
