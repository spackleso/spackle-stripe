import {
  Badge,
  Box,
  Button,
  Icon,
  Inline,
  Spinner,
} from '@stripe/ui-extension-sdk/ui'
import { PricingTable } from '../types'
import PricingTablesProductList from './PricingTablesProductList'
import { useEffect, useState } from 'react'
import PricingTableForm from './PricingTableForm'
import usePricingTableProducts from '../hooks/usePricingTableProducts'
import useApi from '../hooks/useApi'

const PricingTable = ({ pricingTable }: { pricingTable: PricingTable }) => {
  const { post } = useApi()
  const [showForm, setShowForm] = useState(false)

  const {
    data: pricingTableProducts,
    isLoading,
    isRefetching,
  } = usePricingTableProducts(pricingTable.id)

  // TODO: move these to the navigation hook
  useEffect(() => {
    const track = async () => {
      await post('/stripe/identify', {
        path: `/pricing_tables/${pricingTable.id}`,
      })
      await post('/stripe/track', {
        event: '$pageview',
        properties: {
          $current_url: `https://stripe.spackle.so/pricing_tables/${pricingTable.id}`,
        },
      })
    }
    track()
  }, [])

  if (isLoading || isRefetching || !pricingTableProducts) {
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
      }}
    >
      <Box
        css={{
          stack: 'x',
          alignY: 'center',
          distribute: 'space-between',
        }}
      >
        <Box
          css={{ font: 'heading', stack: 'x', gapX: 'small', alignY: 'center' }}
        >
          {pricingTable.name}
          {pricingTable.mode === 0 ? (
            <Badge type="info">Live</Badge>
          ) : (
            <Badge type="warning">Test</Badge>
          )}
        </Box>
        <Box css={{ stack: 'x', gapX: 'small' }}>
          <Button
            type="primary"
            size="small"
            onPress={() => setShowForm(true)}
            css={{ width: 'fill' }}
          >
            <Box
              css={{
                width: 'fill',
                stack: 'x',
                gapX: 'small',
                alignY: 'center',
              }}
            >
              <Icon name="edit"></Icon>
              Edit
            </Box>
          </Button>
        </Box>
      </Box>

      <Box css={{ stack: 'y', gapY: 'small' }}>
        <Box css={{ font: 'subheading', fontWeight: 'bold' }}>
          Pricing Table Products
        </Box>
        {pricingTableProducts.length ? (
          <PricingTablesProductList
            pricingTable={pricingTable}
            pricingTableProducts={pricingTableProducts}
          />
        ) : (
          <Box
            css={{
              keyline: 'neutral',
              padding: 'medium',
              font: 'caption',
              borderRadius: 'small',
              textAlign: 'center',
            }}
          >
            Add products to your pricing table by clicking the{' '}
            <Inline css={{ fontWeight: 'bold' }}>&quot;Settings&quot;</Inline>{' '}
            button above
            {/* TODO: add a link to documentation/getting started */}
          </Box>
        )}
      </Box>
      <PricingTableForm
        pricingTable={pricingTable}
        pricingTableProducts={pricingTableProducts}
        shown={showForm}
        setShown={setShowForm}
      />
    </Box>
  )
}

export default PricingTable
