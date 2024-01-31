import { Box, Button, FocusView } from '@stripe/ui-extension-sdk/ui'
import {
  NewPricingTableProduct,
  PricingTable,
  PricingTableProduct,
} from '../types'
import { useCallback, useState } from 'react'
import useApi from '../hooks/useApi'
import useStripeContext from '../hooks/useStripeContext'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../query'
import useToken from '../hooks/useToken'
import usePublishableToken from '../hooks/usePublishableToken'
import PricingTableFormSettings from './PricingTableFormSettings'
import PricingTableFormProducts from './PricingTableFormProducts'
import PricingTableFormIntegrate from './PricingTableFormIntegrate'

const confirmCloseMessages = {
  title: 'Your pricing table will not be saved',
  description: 'Are you sure you want to exit?',
  cancelAction: 'Cancel',
  exitAction: 'Exit',
}

type PricingTableUpdateData = {
  id: string
  monthly_enabled: boolean
  annual_enabled: boolean
  pricing_table_products: {
    id?: number
    product_id: string
    monthly_stripe_price_id: string | null
    annual_stripe_price_id: string | null
  }[]
}

type PricingTableFormProps = {
  pricingTable: PricingTable
  pricingTableProducts: PricingTableProduct[]
  shown: boolean
  setShown: (val: boolean) => void
}

const PricingTableForm = ({
  pricingTable,
  pricingTableProducts,
  shown,
  setShown,
}: PricingTableFormProps) => {
  const { post } = useApi()
  const { userContext } = useStripeContext()
  const { data: secretToken } = useToken(userContext.account.id)
  const { data: publishableToken } = usePublishableToken(userContext.account.id)
  const [updatedPricingTable, setUpdatedPricingTable] = useState<PricingTable>({
    ...pricingTable,
  })
  const [updatedPricingTableProducts, setUpdatedPricingTableProducts] =
    useState<(PricingTableProduct | NewPricingTableProduct)[]>([
      ...pricingTableProducts,
    ])
  const [confirmClose, setConfirmClose] = useState<boolean>(true)

  const savePricingTable = useMutation({
    mutationFn: async (data: PricingTableUpdateData) => {
      const response = await post(`/stripe/update_pricing_table`, data)
      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error)
      }
      queryClient.invalidateQueries({
        queryKey: ['pricingTables', userContext.account.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['pricingTableProducts', pricingTable.id],
      })
      closeWithoutConfirm()
    },
  })

  const resetForm = useCallback(() => {
    setUpdatedPricingTable(pricingTable)
    setUpdatedPricingTableProducts(pricingTableProducts)
  }, [pricingTable, pricingTableProducts])

  const closeWithConfirm = useCallback(() => {
    setShown(false)
  }, [setShown])

  const closeWithoutConfirm = useCallback(() => {
    setConfirmClose(false)
    setShown(false)
    resetForm()
  }, [setShown, setConfirmClose, resetForm])

  const isModified = !(
    updatedPricingTable.name === pricingTable.name &&
    updatedPricingTable.monthly_enabled === pricingTable.monthly_enabled &&
    updatedPricingTable.annual_enabled === pricingTable.annual_enabled &&
    updatedPricingTableProducts.length === pricingTableProducts.length &&
    updatedPricingTableProducts.every((p) => {
      if (!Object.hasOwn(p, 'id')) return false

      const pricingTableProduct = pricingTableProducts.find(
        (ptp) => ptp.id === (p as PricingTableProduct).id,
      )

      return (
        pricingTableProduct &&
        p.annual_stripe_price?.id ===
          pricingTableProduct.annual_stripe_price?.id &&
        p.monthly_stripe_price?.id ===
          pricingTableProduct.monthly_stripe_price?.id
      )
    })
  )

  return (
    <FocusView
      confirmCloseMessages={
        confirmClose && isModified ? confirmCloseMessages : undefined
      }
      shown={shown}
      setShown={(val) => {
        if (!val) {
          resetForm()
        }
        setShown(val)
      }}
      title={
        pricingTable.name ? `Pricing Table: ${pricingTable.name}` : 'Untitled'
      }
      primaryAction={
        <Button
          type="primary"
          onPress={() => {
            savePricingTable.mutate({
              ...updatedPricingTable,
              pricing_table_products: updatedPricingTableProducts.map((p) => ({
                ...p,
                monthly_stripe_price_id: p.monthly_stripe_price
                  ? p.monthly_stripe_price.id
                  : null,
                annual_stripe_price_id: p.annual_stripe_price
                  ? p.annual_stripe_price.id
                  : null,
                monthly_stripe_price: undefined,
                annual_stripe_price: undefined,
              })),
            })
          }}
          disabled={!isModified || savePricingTable.isLoading}
        >
          Save
        </Button>
      }
      secondaryAction={
        <Button
          onPress={closeWithConfirm}
          disabled={savePricingTable.isLoading}
        >
          Cancel
        </Button>
      }
    >
      <Box css={{ stack: 'y', gapY: 'xlarge' }}>
        <PricingTableFormSettings
          pricingTable={updatedPricingTable}
          setUpdatedPricingTable={setUpdatedPricingTable}
        />
        <PricingTableFormProducts
          error={savePricingTable.error as Error | undefined}
          pricingTable={updatedPricingTable}
          pricingTableProducts={updatedPricingTableProducts}
          setPricingTableProducts={setUpdatedPricingTableProducts}
        />
        <PricingTableFormIntegrate
          pricingTable={updatedPricingTable}
          secretToken={secretToken?.token}
          publishableToken={publishableToken?.token}
        />
      </Box>
    </FocusView>
  )
}

export default PricingTableForm
