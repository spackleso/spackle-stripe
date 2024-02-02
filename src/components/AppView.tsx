import { ContextView } from '@stripe/ui-extension-sdk/ui'
import BrandIcon from '../views/icon.svg'
import FeaturesForm from './FeaturesForm'
import PricingTablesView from './PricingTablesView'
import EntitlementsView from './EntitlementsView'
import ActionBar from './ActionBar'
import useNavigation from '../contexts/NavigationContext'
import HomeView from './HomeView'
import PricingTableView from './PricingTableView'

const AppView = () => {
  const { navState } = useNavigation()

  return (
    <ContextView
      title="Spackle"
      brandColor="#FFFFFF"
      brandIcon={BrandIcon}
      actions={navState.key !== 'home' && <ActionBar />}
    >
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
