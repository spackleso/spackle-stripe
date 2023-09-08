import {
  Box,
  Button,
  FocusView,
  FormFieldGroup,
  Icon,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TextArea,
  TextField,
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
import useToken from '../hooks/useToken'
import { clipboardWriteText, showToast } from '@stripe/ui-extension-sdk/utils'

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
  const { data: token } = useToken(userContext.account.id)
  const [updatedPricingTable, setUpdatedPricingTable] = useState<PricingTable>({
    ...pricingTable,
  })
  const [updatedPricingTableProducts, setUpdatedPricingTableProducts] =
    useState<(PricingTableProduct | NewPricingTableProduct)[]>([
      ...pricingTableProducts,
    ])
  const [confirmClose, setConfirmClose] = useState<boolean>(true)

  const savePricingTable = useMutation(async (data: PricingTableUpdateData) => {
    const response = await post(`/stripe/update_pricing_table`, data)
    if (!response.ok) {
      const { error } = await response.json()
      throw new Error(error)
    }
    queryClient.invalidateQueries(['pricingTables', userContext.account.id])
    queryClient.invalidateQueries(['pricingTableProducts', pricingTable.id])
    closeWithoutConfirm()
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

  const curlCode = `
curl https://api.spackle.so/v1/pricing_tables/${pricingTable.id} \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer ${token?.token}'
`.trim()

  const nodeCode = `
import Spackle from 'spackle-node';
const spackle = new Spackle('${token?.token}')
await spackle.pricingTables.retrieve('${pricingTable.id}')
`.trim()

  const phpCode = `
<?php
require_once('vendor/autoload.php');
\\Spackle\\Spackle::setApiKey('${token?.token}');
\\Spackle\\PricingTable::retrieve('${pricingTable.id}');
?>
`.trim()

  const pythonCode = `
import spackle
spackle.api_key = '${token?.token}'
spackle.PricingTable.retrieve('${pricingTable.id}')
`.trim()

  const rubyCode = `
require 'spackle'
Spackle.api_key = "${token?.token}"
Spackle::PricingTable.retrieve('${pricingTable.id}')
`.trim()

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
            with their associated features. Example: Basic, Premium, Pro
          </Box>

          {(savePricingTable.error as Error | undefined)?.message && (
            <Box
              css={{
                color: 'critical',
                fontWeight: 'semibold',
                textAlign: 'center',
              }}
            >
              {(savePricingTable.error as Error).message}
            </Box>
          )}

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
        <Box>
          <Box css={{ font: 'heading' }}>Integrate</Box>
          <Box
            css={{
              font: 'caption',
              color: 'secondary',
              marginBottom: 'medium',
            }}
          >
            Use the Spackle SDKs to retrieve your pricing table. Read the docs
            for full integration details.
          </Box>
          <Box css={{ stack: 'x', alignY: 'bottom', gapX: 'small' }}>
            <TextField
              disabled
              value={pricingTable.id}
              label="Table ID"
              size="small"
            />
            <Button
              size="small"
              onPress={async () => {
                await clipboardWriteText(pricingTable.id)
                showToast('Copied to clipboard')
              }}
            >
              <Icon name="clipboard" />
            </Button>
          </Box>
          {token ? (
            <Tabs size="small">
              <TabList>
                <Tab tabKey="curl">cURL</Tab>
                <Tab tabKey="nodejs">Node.js</Tab>
                <Tab tabKey="php">PHP</Tab>
                <Tab tabKey="python">Python</Tab>
                <Tab tabKey="ruby">Ruby</Tab>
              </TabList>
              <TabPanels>
                <TabPanel tabKey="curl">
                  <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                    <TextArea
                      defaultValue={curlCode}
                      disabled={true}
                      resizeable={false}
                      rows={3}
                      wrap="off"
                    />
                    <Button
                      onPress={async () => {
                        await clipboardWriteText(curlCode)
                        showToast('Copied to clipboard')
                      }}
                    >
                      <Icon name="clipboard" />
                      Copy
                    </Button>
                  </Box>
                </TabPanel>
                <TabPanel tabKey="nodejs">
                  <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                    <TextArea
                      defaultValue={nodeCode}
                      disabled={true}
                      resizeable={false}
                      rows={3}
                      wrap="off"
                    />
                    <Button
                      onPress={async () => {
                        await clipboardWriteText(nodeCode)
                        showToast('Copied to clipboard')
                      }}
                    >
                      <Icon name="clipboard" />
                      Copy
                    </Button>
                  </Box>
                </TabPanel>
                <TabPanel tabKey="php">
                  <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                    <TextArea
                      defaultValue={phpCode}
                      disabled={true}
                      resizeable={false}
                      rows={5}
                      wrap="off"
                    />
                    <Button
                      onPress={async () => {
                        await clipboardWriteText(phpCode)
                        showToast('Copied to clipboard')
                      }}
                    >
                      <Icon name="clipboard" />
                      Copy
                    </Button>
                  </Box>
                </TabPanel>
                <TabPanel tabKey="python">
                  <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                    <TextArea
                      defaultValue={pythonCode}
                      disabled={true}
                      resizeable={false}
                      rows={3}
                      wrap="off"
                    />
                    <Button
                      onPress={async () => {
                        await clipboardWriteText(pythonCode)
                        showToast('Copied to clipboard')
                      }}
                    >
                      <Icon name="clipboard" />
                      Copy
                    </Button>
                  </Box>
                </TabPanel>
                <TabPanel tabKey="ruby">
                  <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                    <TextArea
                      defaultValue={rubyCode}
                      disabled={true}
                      resizeable={false}
                      rows={3}
                      wrap="off"
                    />
                    <Button
                      onPress={async () => {
                        await clipboardWriteText(rubyCode)
                        showToast('Copied to clipboard')
                      }}
                    >
                      <Icon name="clipboard" />
                      Copy
                    </Button>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
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
          )}
        </Box>
      </Box>
    </FocusView>
  )
}

export default PricingTableForm
