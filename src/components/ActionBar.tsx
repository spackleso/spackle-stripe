import { Box, Button, Icon, Link } from '@stripe/ui-extension-sdk/ui'
import useNavigation from '../hooks/useNavigation'

interface Props {
  setIsShowingPricingTableForm: (isShowing: boolean) => void
  setIsShowingFeaturesForm: (isShowing: boolean) => void
}

const ActionBar = ({
  setIsShowingFeaturesForm,
  setIsShowingPricingTableForm,
}: Props) => {
  const { navigate, navState } = useNavigation()

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
      {navState.key === 'pricingTables' && (
        <Button
          type="secondary"
          size="small"
          onPress={() => setIsShowingPricingTableForm(true)}
        >
          <Box css={{ stack: 'x', gapX: 'xsmall', alignY: 'center' }}>
            <Icon name="add" />
            Create New Table
          </Box>
        </Button>
      )}
      {navState.key === 'entitlements' && (
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
      )}
    </Box>
  )
}

export default ActionBar
