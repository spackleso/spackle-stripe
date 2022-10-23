import { Box, Button, Icon, TextField } from '@stripe/ui-extension-sdk/ui'
import { clipboardWriteText, showToast } from '@stripe/ui-extension-sdk/utils'
import useStripeContext from '../hooks/useStripeContext'
import useToken from '../hooks/useToken'

const SettingsView = () => {
  const { userContext } = useStripeContext()
  const { data } = useToken(userContext?.account.id)

  return (
    <Box css={{ stack: 'x', gap: 'small', alignY: 'bottom' }}>
      <TextField disabled value={data?.token || ''} label="Access Token" />
      <Button
        onPress={async () => {
          if (data?.token) {
            await clipboardWriteText(data.token)
            showToast('Copied!', { type: 'success' })
          }
        }}
      >
        <Icon name="clipboard" />
      </Button>
    </Box>
  )
}

export default SettingsView
