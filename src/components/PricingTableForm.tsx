import { Box, Button, FocusView } from '@stripe/ui-extension-sdk/ui'
import {
  NewPricingTableProduct,
  PricingTable,
  PricingTableCreateData,
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
    PricingTableCreateData | PricingTableUpdateData,
    unknown
  >
  deletePricingTable?: UseMutationResult<void, unknown, string, unknown>
}

const PricingTableForm = ({
  pricingTable,
  pricingTableProducts,
  savePricingTable,
  deletePricingTable,
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
  const [isDeleting, setIsDeleting] = useState(false)

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
      confirmCloseMessages={
        pricingTable.id && isModified ? confirmCloseMessages : undefined
      }
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
        !isDeleting ? (
          <Button
            type="primary"
            onPress={() => {
              savePricingTable.mutate({
                ...updatedPricingTable,
                pricing_table_products: updatedPricingTableProducts.map(
                  (p) => ({
                    ...p,
                    monthly_stripe_price_id: p.monthly_stripe_price
                      ? p.monthly_stripe_price.id
                      : null,
                    annual_stripe_price_id: p.annual_stripe_price
                      ? p.annual_stripe_price.id
                      : null,
                    monthly_stripe_price: undefined,
                    annual_stripe_price: undefined,
                  }),
                ),
              })
            }}
            disabled={!isModified || savePricingTable.isLoading}
          >
            Save
          </Button>
        ) : undefined
      }
      secondaryAction={
        !isDeleting ? (
          <Button
            onPress={closeWithConfirm}
            disabled={savePricingTable.isLoading}
          >
            Cancel
          </Button>
        ) : undefined
      }
      footerContent={
        deletePricingTable && !isDeleting ? (
          <Button type="destructive" onPress={() => setIsDeleting(true)}>
            Delete
          </Button>
        ) : undefined
      }
    >
      {isDeleting ? (
        <Box css={{ stack: 'x', paddingTop: 'large' }}>
          <Box
            css={{
              stack: 'y',
              keyline: 'neutral',
              padding: 'large',
              borderRadius: 'medium',
              gapY: 'large',
            }}
          >
            <Box css={{ font: 'heading', textAlign: 'center' }}>
              Are you sure you want to delete{' '}
              {pricingTable.name ? pricingTable.name : 'Pricing Table'}?
            </Box>
            <Box
              css={{
                stack: 'x',
                alignY: 'center',
                alignX: 'center',
                gapX: 'medium',
              }}
            >
              <Button
                type="destructive"
                onPress={() => deletePricingTable?.mutate(pricingTable.id)}
              >
                Delete
              </Button>
              <Button onPress={() => setIsDeleting(false)}>Cancel</Button>
            </Box>
          </Box>
        </Box>
      ) : (
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
          {pricingTable.id && (
            <PricingTableFormIntegrate
              pricingTable={updatedPricingTable}
              secretToken={secretToken?.token}
              publishableToken={publishableToken?.token}
            />
          )}
        </Box>
      )}
    </FocusView>
  )
}

export default PricingTableForm
