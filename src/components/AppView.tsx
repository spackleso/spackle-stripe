import { ContextView } from '@stripe/ui-extension-sdk/ui'
import BrandIcon from '../views/icon.svg'
import { useState } from 'react'
import FeaturesForm from './FeaturesForm'
import PricingTablesView from './PricingTablesView'
import EntitlementsView from './EntitlementsView'
import ActionBar from './ActionBar'
import useNavigation from '../hooks/useNavigation'
import HomeView from './HomeView'
import PricingTableView from './PricingTableView'

const AppView = () => {
  const { navState } = useNavigation()
  const [isShowingPricingTableForm, setIsShowingPricingTableForm] =
    useState(false)
  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  return (
    <ContextView
      title="Spackle"
      brandColor="#FFFFFF"
      brandIcon={BrandIcon}
      actions={
        navState.key !== 'home' && (
          <ActionBar
            setIsShowingPricingTableForm={setIsShowingPricingTableForm}
            setIsShowingFeaturesForm={setIsShowingFeaturesForm}
          />
        )
      }
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
      <FeaturesForm
        shown={isShowingFeaturesForm}
        setShown={setIsShowingFeaturesForm}
      />
    </ContextView>
  )
}

export default AppView
