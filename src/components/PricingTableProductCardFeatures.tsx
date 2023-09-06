import { Box, Icon, Spinner } from '@stripe/ui-extension-sdk/ui'
import {
  Feature,
  FeatureType,
  NewPricingTableProduct,
  PricingTableProduct,
} from '../types'
import useStripeContext from '../hooks/useStripeContext'
import useProductState from '../hooks/useProductState'

const PricingTableProductCardFeatures = ({
  product,
}: {
  product: PricingTableProduct | NewPricingTableProduct
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
          {feature.type === FeatureType.Flag && (
            <Box>
              {feature.value_flag ? (
                <Icon name="check" size="xsmall" css={{ fill: 'success' }} />
              ) : (
                <Icon name="delete" size="xsmall" css={{ fill: 'critical' }} />
              )}
            </Box>
          )}

          {feature.type === FeatureType.Limit && (
            <Box>
              {feature.value_limit === null
                ? '∞'
                : feature.value_limit.toString()}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

export default PricingTableProductCardFeatures
