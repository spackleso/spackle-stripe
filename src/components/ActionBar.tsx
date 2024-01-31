import { Box, Button, Icon, Link } from '@stripe/ui-extension-sdk/ui'
import { useFeaturesForm } from '../contexts/FeaturesFormContext'
import useNavigation from '../contexts/NavigationContext'

const ActionBar = () => {
  const { navigate, navState } = useNavigation()
  const { setIsShowingFeaturesForm } = useFeaturesForm()

  if (navState.key === 'home') {
    return null
  }

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
        onPress={() => navigate({ key: 'home', param: '' })}
      >
        <Box css={{ stack: 'x', gapX: 'xsmall', alignY: 'center' }}>
          <Icon name="arrowLeft" size="xsmall" />
          <Icon name="home" />
        </Box>
      </Link>
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

          <Button
            type="secondary"
            size="small"
            href="https://docs.spackle.so/entitlements"
            target="_blank"
          >
            Docs
            <Icon name="external" size="xsmall" />
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default ActionBar
