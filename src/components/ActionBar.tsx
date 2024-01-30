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
  )
}

export default ActionBar
