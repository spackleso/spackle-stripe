import { Box } from '@stripe/ui-extension-sdk/ui'
import useNavigation from '../contexts/NavigationContext'
import NavItem from './NavItem'

const HomeView = () => {
  const { navigate } = useNavigation()

  return (
    <Box css={{ stack: 'y', gapY: 'large' }}>
      <NavItem
        label="Pricing Tables"
        description="Create and manage pricing tables for new and returning customers"
        onPress={() => navigate({ key: 'pricingTables', param: '' })}
      />
      <NavItem
        label="Entitlements"
        description="Manage feature access at the product and customer level"
        onPress={() => {
          navigate({ key: 'entitlements', param: '' })
        }}
      />
      <NavItem
        label="Documentation"
        description="Add Spackle to your SaaS product"
        href={'https://docs.spackle.so'}
        external={true}
      />
    </Box>
  )
}

export default HomeView
