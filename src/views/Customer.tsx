import { ContextView, Box, Link, Icon } from '@stripe/ui-extension-sdk/ui'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useEffect, useState } from 'react'
import BrandIcon from './brand_icon.svg'
import useApi from '../hooks/useApi'
import { CustomerFeature, Feature } from '../types'
import FeatureList from '../components/FeatureList'

const Customer = (context: ExtensionContextValue) => {
  const customerId = context.environment.objectContext?.id
  const { post } = useApi(context)
  const [accountFeatures, setAccountFeatures] = useState<Feature[]>([])
  const [customerFeatures, setCustomerFeatures] = useState<CustomerFeature[]>(
    [],
  )
  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  useEffect(() => {
    post(`api/stripe/get_account_features`, {}).then((res) =>
      res.json().then((data) => setAccountFeatures(data.data)),
    )
    post(`api/stripe/get_customer_features`, {
      customer_id: customerId,
    }).then((res) => res.json().then((data) => setCustomerFeatures(data.data)))
  }, [post, customerId])

  return (
    <ContextView
      title="Features"
      brandColor="#F6F8FA"
      brandIcon={BrandIcon}
      actions={
        <>
          <Box>
            <Link
              onPress={() => setIsShowingFeaturesForm(!isShowingFeaturesForm)}
            >
              <Icon name="settings" />
              Manage Features
            </Link>
          </Box>
        </>
      }
    >
      <FeatureList features={accountFeatures} overrides={customerFeatures} />
    </ContextView>
  )
}

export default Customer
