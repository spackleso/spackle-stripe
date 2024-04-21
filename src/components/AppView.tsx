import { Banner, Box, ContextView } from '@stripe/ui-extension-sdk/ui'
import { useEffect, useCallback } from 'react'
import BrandIcon from '../views/icon.svg'
import FeaturesForm from './FeaturesForm'
import PricingTablesView from './PricingTablesView'
import EntitlementsView from './EntitlementsView'
import ActionBar from './ActionBar'
import useNavigation from '../contexts/NavigationContext'
import HomeView from './HomeView'
import PricingTableView from './PricingTableView'
import useAccount from '../hooks/useAccount'
import useStripeContext from '../hooks/useStripeContext'
import useApi from '../hooks/useApi'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const AppView = () => {
  const { post } = useApi()
  const { navState } = useNavigation()
  const { userContext } = useStripeContext()
  const { data: account, refetch } = useAccount(userContext.account.id)

  const startSync = useCallback(async () => {
    await post('/stripe/sync_account', {})
  }, [post])

  const pollAccount = useCallback(async (): Promise<boolean> => {
    await delay(3000)
    const { data } = await refetch()

    if (data.initial_sync_complete) {
      return true
    } else if (!data.initial_sync_started_at) {
      await startSync()
    } else {
      const diff =
        (new Date() as unknown as number) -
        (new Date(data.initial_sync_started_at) as unknown as number)
      if (diff > 15 * 60 * 1000) {
        await startSync()
      }
    }

    return await pollAccount()
  }, [refetch, startSync])

  useEffect(() => {
    if (!account || !account.has_acknowledged_setup) {
      return
    }

    if (!account.initial_sync_started_at) {
      startSync()
      pollAccount()
    } else if (!account.initial_sync_complete) {
      pollAccount()
    }
  }, [account, pollAccount, startSync])

  return (
    <ContextView
      title="Spackle"
      brandColor="#FFFFFF"
      brandIcon={BrandIcon}
      actions={<ActionBar />}
    >
      {account && !account.initial_sync_complete ? (
        <Box css={{ marginBottom: 'large' }}>
          <Banner
            type="caution"
            title="Initial sync in progress"
            description="We're syncing your data with Stripe. This may take a few minutes."
          />
        </Box>
      ) : null}

      {navState.key === 'home' ? (
        <HomeView />
      ) : navState.key === 'pricingTables' ? (
        <PricingTablesView />
      ) : navState.key === 'entitlements' ? (
        <EntitlementsView />
      ) : navState.key === 'pricingTable' ? (
        <PricingTableView pricingTableId={navState.param} />
      ) : null}

      <FeaturesForm />
    </ContextView>
  )
}

export default AppView
