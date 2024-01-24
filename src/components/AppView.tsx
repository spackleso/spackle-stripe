import { Box, Button, ContextView, Icon } from '@stripe/ui-extension-sdk/ui'
import BrandIcon from '../views/icon.svg'
import { Tabs, Tab, TabList, TabPanels } from '@stripe/ui-extension-sdk/ui'
import EntitlementsTab from '../components/EntitlementsTab'
import PricingTableTab from '../components/PricingTableTab'
import { Key, useEffect, useState } from 'react'
import useStripeContext from '../hooks/useStripeContext'
import FeaturesForm from './FeaturesForm'

const PRICING_TABLE_TAB_KEY = '1'
const ENTITLEMENTS_TAB_KEY = '2'

const AppView = () => {
  const { environment } = useStripeContext()
  const [key, setKey] = useState<Key>(PRICING_TABLE_TAB_KEY)

  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  useEffect(() => {
    if (
      environment.objectContext?.object === 'customer' ||
      environment.objectContext?.object === 'product'
    ) {
      setKey(ENTITLEMENTS_TAB_KEY)
    }
  }, [environment.objectContext?.object])

  return (
    <ContextView
      title="Spackle"
      brandColor="#FFFFFF"
      brandIcon={BrandIcon}
      actions={
        <Box css={{ stack: 'x', gapX: 'small' }}>
          <Button
            type="secondary"
            size="small"
            css={{ width: 'fill' }}
            onPress={() => setIsShowingFeaturesForm(!isShowingFeaturesForm)}
          >
            <Box css={{ stack: 'x', gapX: 'xsmall', alignY: 'center' }}>
              <Icon name="settings" />
              Manage Features
            </Box>
          </Button>
          <Button
            type="secondary"
            size="small"
            href="https://docs.spackle.so"
            target="_blank"
          >
            <Box css={{ stack: 'x', gapX: 'small', alignY: 'center' }}>
              Docs
              <Icon name="external" />
            </Box>
          </Button>
        </Box>
      }
    >
      <Tabs size="small" fitted selectedKey={key} onSelectionChange={setKey}>
        <TabList>
          <Tab
            disabled={environment.objectContext?.object === 'customer'}
            tabKey={PRICING_TABLE_TAB_KEY}
          >
            Pricing Tables
          </Tab>
          <Tab tabKey={ENTITLEMENTS_TAB_KEY}>Entitlements</Tab>
        </TabList>
        <TabPanels>
          <PricingTableTab tabKey={PRICING_TABLE_TAB_KEY} />
          <EntitlementsTab tabKey={ENTITLEMENTS_TAB_KEY} />
        </TabPanels>
      </Tabs>
      <FeaturesForm
        shown={isShowingFeaturesForm}
        setShown={setIsShowingFeaturesForm}
      />
    </ContextView>
  )
}

export default AppView
