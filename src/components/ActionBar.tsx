import { Box, Button, Icon, Link } from '@stripe/ui-extension-sdk/ui'
import { useFeaturesForm } from '../contexts/FeaturesFormContext'
import useNavigation from '../contexts/NavigationContext'

const ActionBar = () => {
  const { navigate, navState } = useNavigation()
  const { setIsShowingFeaturesForm } = useFeaturesForm()

  return (
    <Box
      css={{
        stack: 'x',
        gapX: 'medium',
        alignY: 'center',
        distribute: 'space-between',
      }}
    >
      <Link
        type="secondary"
        disabled={navState.key === 'home'}
        onPress={() => navigate({ key: 'home', param: '' })}
      >
        <Box css={{ stack: 'x', gapX: 'small', alignY: 'center' }}>
          <Icon name="arrowLeft" size="xsmall" />
          <Icon name="home" size="small" />
        </Box>
      </Link>

      {navState.key === 'pricingTable' && (
        <Link
          type="secondary"
          onPress={() => navigate({ key: 'pricingTables', param: '' })}
        >
          <Box css={{ stack: 'x', gapX: 'small', alignY: 'center' }}>
            <Icon name="arrowLeft" size="xsmall" />
            <Box>Pricing Tables</Box>
          </Box>
        </Link>
      )}

      <Box css={{ stack: 'x', gapX: 'small' }}>
        <Button
          type="secondary"
          size="small"
          onPress={() => setIsShowingFeaturesForm(true)}
        >
          <Box css={{ stack: 'x', gapX: 'xsmall', alignY: 'center' }}>
            <Icon name="settings" />
            Manage Features
          </Box>
        </Button>
        {navState.key.startsWith('pricingTable') && (
          <Button
            type="secondary"
            size="small"
            href="https://docs.spackle.so/pricing-tables"
            target="_blank"
          >
            Docs
            <Icon name="external" size="xsmall" />
          </Button>
        )}
        {navState.key === 'entitlements' && (
          <Button
            type="secondary"
            size="small"
            href="https://docs.spackle.so/entitlements"
            target="_blank"
          >
            Docs
            <Icon name="external" size="xsmall" />
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default ActionBar
