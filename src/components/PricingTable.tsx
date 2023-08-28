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
import { useState } from 'react'
import PricingTableForm from './PricingTableForm'
import usePricingTableProducts from '../hooks/usePricingTableProducts'

const PricingTable = ({ pricingTable }: { pricingTable: PricingTable }) => {
  const [showForm, setShowForm] = useState(false)

  const {
    data: pricingTableProducts,
    isLoading,
    isRefetching,
  } = usePricingTableProducts(pricingTable.id)

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
        <Box css={{ stack: 'x', gapX: 'small' }}>
          <Button
            type="secondary"
            onPress={() => setShowForm(true)}
            css={{ width: 'fill' }}
          >
            Edit
          </Button>
          <Button type="secondary" css={{ width: 'fill' }}>
            Preview
            <Icon name="external" size="xsmall" />
          </Button>
        </Box>
        <Box>
          {pricingTable.mode === 0 ? (
            <Badge type="info">Live</Badge>
          ) : (
            <Badge type="warning">Test</Badge>
          )}
        </Box>
      </Box>

      <Box css={{ stack: 'y', gapY: 'small' }}>
        <Box css={{ font: 'heading', fontWeight: 'bold' }}>
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
            <Inline css={{ fontWeight: 'bold' }}>&quot;Edit&quot;</Inline>{' '}
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
