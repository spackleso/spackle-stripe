import { Box, Button, Divider, Icon, Inline } from '@stripe/ui-extension-sdk/ui'
import { useState } from 'react'

const _priceTable = {
  id: 1,
  slug: 'abc123',
  name: 'Default',
  intervals: ['month', 'year'],
  products: [
    {
      id: 1,
      name: 'Basic',
      prices: {
        month: {
          id: 1,
          unit_amount: 1000,
          currency: 'usd',
        },
        year: {
          id: 2,
          unit_amount: 10000,
          currency: 'usd',
        },
      },
      features: [
        {
          id: 1,
          name: 'Basic Feature',
          key: 'basic',
          value_flag: true,
        },
        {
          id: 2,
          name: 'Pro Feature',
          key: 'pro',
          value_flag: false,
        },
        {
          id: 3,
          name: 'Enterprise Feature',
          key: 'enterprise',
          value_flag: false,
        },
      ],
    },
    {
      id: 2,
      name: 'Pro',
      prices: {
        month: {
          id: 3,
          unit_amount: 2000,
          currency: 'usd',
        },
        year: {
          id: 4,
          unit_amount: 20000,
          currency: 'usd',
        },
      },
      features: [
        {
          id: 1,
          name: 'Basic Feature',
          key: 'basic',
          value_flag: true,
        },
        {
          id: 2,
          name: 'Pro Feature',
          key: 'pro',
          value_flag: true,
        },
        {
          id: 3,
          name: 'Enterprise Feature',
          key: 'enterprise',
          value_flag: false,
        },
      ],
    },
    {
      id: 3,
      name: 'Enterprise',
      prices: {
        month: {
          id: 5,
          unit_amount: 3000,
          currency: 'usd',
        },
        year: {
          id: 6,
          unit_amount: 30000,
          currency: 'usd',
        },
      },
      features: [
        {
          id: 1,
          name: 'Basic Feature',
          key: 'basic',
          value_flag: true,
        },
        {
          id: 2,
          name: 'Pro Feature',
          key: 'pro',
          value_flag: true,
        },
        {
          id: 3,
          name: 'Enterprise Feature',
          key: 'enterprise',
          value_flag: true,
        },
      ],
    },
  ],
}

const PricingTablesView = () => {
  const [priceTable, setPriceTable] = useState(_priceTable)

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
        {priceTable.products.map((product) => (
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
                {priceTable.intervals.map((interval) => (
                  <Inline key={interval}>
                    ${product.prices[interval].unit_amount / 100}/{interval}{' '}
                  </Inline>
                ))}
              </Box>
            </Box>
            <Divider />
            <Box css={{ stack: 'y', gapY: 'small' }}>
              {product.features.map((feature) => (
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
