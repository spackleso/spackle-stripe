import { Box, SettingsView } from '@stripe/ui-extension-sdk/ui'
import { useState, useEffect } from 'react'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import type { Feature } from '../types'
import useApi from '../hooks/useApi'

const AppSettings = (context: ExtensionContextValue) => {
  const [features, setFeatures] = useState<Feature[]>([])
  const { post } = useApi(context)

  useEffect(() => {
    const productId = context.environment.objectContext?.id
    post(`api/stripe/get_account_features`, {
      product_id: productId,
    }).then((res) => res.json().then((data) => setFeatures(data.features)))
  }, [post, context.environment.objectContext?.id])

  return (
    <SettingsView
      onSave={() => {
        console.log('Saved')
      }}
    >
      <Box>Settings</Box>
    </SettingsView>
  )
}

export default AppSettings
