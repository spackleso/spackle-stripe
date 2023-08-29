import {
  Box,
  Button,
  FocusView,
  FormFieldGroup,
  Switch,
} from '@stripe/ui-extension-sdk/ui'
import {
  NewPricingTableProduct,
  PricingTable,
  PricingTableProduct,
} from '../types'
import { useCallback, useState } from 'react'
import PricingTablesProductList from './PricingTablesProductList'
import PricingTableAddProductForm from './PricingTableProductCreateForm'
import useApi from '../hooks/useApi'
import useStripeContext from '../hooks/useStripeContext'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../query'

const confirmCloseMessages = {
  title: 'Your pricing table will not be saved',
  description: 'Are you sure you want to exit?',
  cancelAction: 'Cancel',
  exitAction: 'Exit',
}

type PricingTableUpdateData = {
  id: number
  monthly_enabled: boolean
  annual_enabled: boolean
  pricing_table_products: {
    id?: number
    product_id: string
    monthly_stripe_price_id: string | null
    annual_stripe_price_id: string | null
  }[]
}

const PricingTableForm = ({
  pricingTable,
  pricingTableProducts,
  shown,
  setShown,
}: {
  pricingTable: PricingTable
  pricingTableProducts: PricingTableProduct[]
  shown: boolean
  setShown: (val: boolean) => void
}) => {
  const { post } = useApi()
  const { userContext } = useStripeContext()
  const [updatedPricingTable, setUpdatedPricingTable] =
    useState<PricingTable>(pricingTable)
  const [updatedPricingTableProducts, setUpdatedPricingTableProducts] =
    useState<(PricingTableProduct | NewPricingTableProduct)[]>(
      pricingTableProducts,
    )
  const [confirmClose, setConfirmClose] = useState<boolean>(true)

  const savePricingTable = useMutation(async (data: PricingTableUpdateData) => {
    const response = await post(`/stripe/update_pricing_table`, data)
    queryClient.invalidateQueries(['pricingTables', userContext.account.id])
    queryClient.invalidateQueries(['pricingTableProducts', pricingTable.id])
    return response
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
      title={'Pricing Table'}
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
              })),
            })
            closeWithoutConfirm()
          }}
          disabled={!isModified}
        >
          Save
        </Button>
      }
      secondaryAction={<Button onPress={closeWithConfirm}>Cancel</Button>}
    >
      <Box css={{ stack: 'y', gapY: 'large' }}>
        <Box>
          <Box css={{ font: 'heading', marginBottom: 'medium' }}>Settings</Box>
          <FormFieldGroup
            legend="Intervals"
            description="Choose the billing intervals customers can select from your pricing table. Only monthly and annual intervals are supported at this time."
            layout="column"
          >
            <Switch
              label="Monthly"
              defaultChecked={updatedPricingTable.monthly_enabled}
              onChange={(e) => {
                setUpdatedPricingTable({
                  ...updatedPricingTable,
                  monthly_enabled: e.target.checked,
                })
              }}
            />
            <Switch
              label="Annual"
              defaultChecked={updatedPricingTable.annual_enabled}
              onChange={(e) => {
                setUpdatedPricingTable({
                  ...updatedPricingTable,
                  annual_enabled: e.target.checked,
                })
              }}
            />
          </FormFieldGroup>
        </Box>

        <Box>
          <Box css={{ font: 'heading' }}>Products</Box>
          <Box
            css={{
              font: 'caption',
              color: 'secondary',
              marginBottom: 'medium',
            }}
          >
            These are the products that will be displayed in your pricing table
            with their associated features.
          </Box>
          <PricingTablesProductList
            pricingTable={updatedPricingTable}
            pricingTableProducts={updatedPricingTableProducts}
            isEditable={true}
            setPricingTableProducts={setUpdatedPricingTableProducts}
          />
          <PricingTableAddProductForm
            pricingTable={updatedPricingTable}
            pricingTableProducts={updatedPricingTableProducts}
            setPricingTableProducts={setUpdatedPricingTableProducts}
          />
        </Box>
      </Box>
    </FocusView>
  )
}

export default PricingTableForm
