import {
  Box,
  Button,
  Divider,
  Icon,
  Inline,
  Spinner,
} from '@stripe/ui-extension-sdk/ui'
import usePricingTables from '../hooks/usePricingTables'
import useStripeContext from '../hooks/useStripeContext'

const PricingTablesView = () => {
  const { userContext } = useStripeContext()
  const {
    data: priceTables,
    isLoading,
    isRefetching,
  } = usePricingTables(userContext.account.id)

  if (isLoading || isRefetching) {
    return (
      <Box
        css={{
          stack: 'x',
          alignX: 'center',
          alignY: 'center',
          width: 'fill',
          height: 'fill',
          marginTop: 'xlarge',
        }}
      >
        <Spinner />
      </Box>
    )
  }

  return (
    <Box
      css={{
        stack: 'y',
        gapY: 'large',
        marginTop: 'large',
      }}
    >
      <Box
        css={{
          stack: 'x',
          gapX: 'large',
        }}
      >
        <Button type="secondary" css={{ width: 'fill' }}>
          Edit
        </Button>
        <Button type="secondary" css={{ width: 'fill' }}>
          Preview
          <Icon name="external" size="xsmall" />
        </Button>
      </Box>

      <Box css={{ stack: 'y', gapY: 'small' }}>
        {priceTables[0].products.map((product: any) => (
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
                {priceTables[0].intervals.map((interval: any) => (
                  <Inline key={interval}>
                    ${product.prices[interval].unit_amount / 100}/{interval}{' '}
                  </Inline>
                ))}
              </Box>
            </Box>
            <Divider />
            <Box css={{ stack: 'y', gapY: 'small' }}>
              {product.features.map((feature: any) => (
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
    </Box>
  )
}

export default PricingTablesView
