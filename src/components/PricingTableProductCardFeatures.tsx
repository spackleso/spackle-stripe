import { Box, Icon, Spinner } from '@stripe/ui-extension-sdk/ui'
import { Feature, PricingTableProduct } from '../types'
import useStripeContext from '../hooks/useStripeContext'
import useProductState from '../hooks/useProductState'

const PricingTableProductCardFeatures = ({
  product,
}: {
  product: PricingTableProduct
}) => {
  const { environment } = useStripeContext()
  const { data: features } = useProductState(
    product.product_id,
    environment.mode,
  )

  if (!features) {
    return (
      <Box
        css={{
          stack: 'x',
          alignX: 'center',
          alignY: 'center',
          width: 'fill',
          height: 'fill',
        }}
      >
        <Spinner />
      </Box>
    )
  } else if (features.length === 0) {
    return (
      <Box css={{ textAlign: 'center', font: 'caption', paddingY: 'small' }}>
        No features added yet
      </Box>
    )
  }

  return (
    <Box css={{ stack: 'y', gapY: 'small' }}>
      {features.map((feature: Feature) => (
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
              <Icon name="check" size="xsmall" css={{ fill: 'success' }} />
            ) : (
              <Icon name="delete" size="xsmall" css={{ fill: 'critical' }} />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default PricingTableProductCardFeatures
