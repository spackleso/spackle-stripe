import {
  Box,
  ContextView,
  Icon,
  Link,
  Spinner,
} from '@stripe/ui-extension-sdk/ui'
import BrandIcon from '../views/icon.svg'
import { Tabs, Tab, TabList, TabPanels } from '@stripe/ui-extension-sdk/ui'
import EntitlementsTab from '../components/EntitlementsTab'
import PricingTableTab from '../components/PricingTableTab'
import { useState } from 'react'
import useStripeContext from '../hooks/useStripeContext'
import { useEntitlements } from '../hooks/useEntitlements'
import FeaturesForm from './FeaturesForm'

const PRICING_TABLE_TAB_KEY = '1'
const ENTITLEMENTS_TAB_KEY = '2'

const AppView = () => {
  const { environment, userContext } = useStripeContext()

  const entitlements = useEntitlements(userContext.account.id)
  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  const entitled =
    entitlements.data?.flag('entitlements') || environment.mode === 'test'

  return (
    <ContextView
      title="Spackle"
      brandColor="#FFFFFF"
      brandIcon={BrandIcon}
      externalLink={{
        label: 'Documentation',
        href: 'https://docs.spackle.so',
      }}
      footerContent={
        entitled && (
          <>
            <Box>
              <Link
                type="secondary"
                onPress={() => setIsShowingFeaturesForm(!isShowingFeaturesForm)}
              >
                <Box css={{ stack: 'x', gapX: 'xsmall', alignY: 'center' }}>
                  <Icon name="settings" />
                  Manage Features
                </Box>
              </Link>
            </Box>
          </>
        )
      }
    >
      {entitlements.isLoading ? (
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
      ) : (
        <Tabs size="small" fitted>
          <TabList>
            <Tab tabKey={PRICING_TABLE_TAB_KEY}>Pricing Table</Tab>
            <Tab tabKey={ENTITLEMENTS_TAB_KEY}>Entitlements</Tab>
          </TabList>
          <TabPanels>
            <PricingTableTab tabKey={PRICING_TABLE_TAB_KEY} />
            <EntitlementsTab tabKey={ENTITLEMENTS_TAB_KEY} />
          </TabPanels>
        </Tabs>
      )}
      <FeaturesForm
        shown={isShowingFeaturesForm}
        setShown={setIsShowingFeaturesForm}
      />
    </ContextView>
  )
}

export default AppView
