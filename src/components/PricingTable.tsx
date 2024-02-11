import {
  Badge,
  Box,
  Button,
  Icon,
  Inline,
  Spinner,
} from '@stripe/ui-extension-sdk/ui'
import {
  PricingTable,
  PricingTableCreateData,
  PricingTableUpdateData,
} from '../types'
import PricingTablesProductList from './PricingTablesProductList'
import { useEffect } from 'react'
import PricingTableForm from './PricingTableForm'
import usePricingTableProducts from '../hooks/usePricingTableProducts'
import useApi from '../hooks/useApi'
import { usePricingTableForm } from '../contexts/PricingTableFormContext'
import { queryClient } from '../query'
import { useMutation } from '@tanstack/react-query'
import useStripeContext from '../hooks/useStripeContext'
import useNavigation from '../contexts/NavigationContext'

const PricingTable = ({ pricingTable }: { pricingTable: PricingTable }) => {
  const { post } = useApi()
  const navigation = useNavigation()
  const { userContext } = useStripeContext()
  const { setIsShowingPricingTableForm } = usePricingTableForm()

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

  const savePricingTable = useMutation({
    mutationFn: async (
      data: PricingTableCreateData | PricingTableUpdateData,
    ) => {
      const response = await post(`/stripe/update_pricing_table`, data)
      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }
      queryClient.invalidateQueries({
        queryKey: ['pricingTables', userContext.account.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['pricingTable', pricingTable.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['pricingTableProducts', pricingTable.id],
      })
      setIsShowingPricingTableForm(false)
    },
  })

  const deletePricingTable = useMutation({
    mutationFn: async (id: string) => {
      const response = await post(`/stripe/delete_pricing_table`, { id })
      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }
      queryClient.invalidateQueries({
        queryKey: ['pricingTables', userContext.account.id],
      })
      setIsShowingPricingTableForm(false)
      navigation.navigate({
        key: 'pricingTables',
        param: '',
      })
    },
  })

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
            onPress={() => setIsShowingPricingTableForm(true)}
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
              <Icon name="settings"></Icon>
              Configure
            </Box>
          </Button>
        </Box>
      </Box>

      <Box css={{ stack: 'y', gapY: 'small' }}>
        <Box css={{ font: 'subheading', fontWeight: 'bold' }}>Products</Box>
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
        savePricingTable={savePricingTable}
        deletePricingTable={deletePricingTable}
      />
    </Box>
  )
}

export default PricingTable
