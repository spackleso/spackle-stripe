import { Box, Button, FocusView } from '@stripe/ui-extension-sdk/ui'
import {
  NewPricingTableProduct,
  PricingTable,
  PricingTableProduct,
  PricingTableUpdateData,
} from '../types'
import { useCallback, useState } from 'react'
import useStripeContext from '../hooks/useStripeContext'
import { UseMutationResult } from '@tanstack/react-query'
import useToken from '../hooks/useToken'
import usePublishableToken from '../hooks/usePublishableToken'
import PricingTableFormSettings from './PricingTableFormSettings'
import PricingTableFormProducts from './PricingTableFormProducts'
import PricingTableFormIntegrate from './PricingTableFormIntegrate'
import { usePricingTableForm } from '../contexts/PricingTableFormContext'

const confirmCloseMessages = {
  title: 'Your pricing table will not be saved',
  description: 'Are you sure you want to exit?',
  cancelAction: 'Cancel',
  exitAction: 'Exit',
}

type PricingTableFormProps = {
  pricingTable: PricingTable
  pricingTableProducts: PricingTableProduct[]
  savePricingTable: UseMutationResult<
    void,
    unknown,
    PricingTableUpdateData,
    unknown
  >
}

const PricingTableForm = ({
  pricingTable,
  pricingTableProducts,
  savePricingTable,
}: PricingTableFormProps) => {
  const { isShowingPricingTableForm, setIsShowingPricingTableForm } =
    usePricingTableForm()
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

  const resetForm = useCallback(() => {
    setUpdatedPricingTable(pricingTable)
    setUpdatedPricingTableProducts(pricingTableProducts)
  }, [pricingTable, pricingTableProducts])

  const closeWithConfirm = useCallback(() => {
    setIsShowingPricingTableForm(false)
  }, [setIsShowingPricingTableForm])

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
      confirmCloseMessages={isModified ? confirmCloseMessages : undefined}
      shown={isShowingPricingTableForm}
      setShown={(val) => {
        if (!val) {
          resetForm()
        }
        setIsShowingPricingTableForm(val)
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
