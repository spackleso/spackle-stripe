import {
  Button,
  Box,
  FocusView,
  Accordion,
  AccordionItem,
  Switch,
} from '@stripe/ui-extension-sdk/ui'
import useApi from '../hooks/useApi'
import { Feature, FeatureType, NewFeature } from '../types'
import { useState } from 'react'
import FeatureForm from './FeatureForm'
import useAccountFeatures from '../hooks/useAccountFeatures'
import { queryClient } from '../query'
import useStripeContext from '../hooks/useStripeContext'
import { useMutation } from '@tanstack/react-query'

const FeaturesForm = ({
  shown,
  setShown,
}: {
  shown: boolean
  setShown: (val: boolean) => void
}) => {
  const { userContext } = useStripeContext()
  const [isShowingNewForm, setIsShowingNewForm] = useState<boolean>(false)
  const { data: features } = useAccountFeatures(userContext.account.id)
  const { post } = useApi()

  const update = useMutation(async (feature: Feature | NewFeature) => {
    const response = await post(`api/stripe/update_account_feature`, feature)
    if (response.status !== 200) {
      const error = (await response.json()).error
      throw new Error(error)
    }

    queryClient.invalidateQueries(['accountFeatures'])
    queryClient.invalidateQueries(['accountState'])
    queryClient.invalidateQueries(['customerFeatures'])
    queryClient.invalidateQueries(['productState'])
    queryClient.invalidateQueries(['subscriptionsState'])
    return response
  })

  const create = useMutation(async (feature: NewFeature | Feature) => {
    const response = await post(`api/stripe/create_account_feature`, feature)
    if (response.status !== 201) {
      const error = (await response.json()).error
      throw new Error(error)
    }

    queryClient.invalidateQueries(['accountFeatures'])
    queryClient.invalidateQueries(['accountState'])
    queryClient.invalidateQueries(['customerFeatures'])
    queryClient.invalidateQueries(['productState'])
    queryClient.invalidateQueries(['subscriptionsState'])
    setIsShowingNewForm(false)
    return response
  })

  const destroy = useMutation(async (feature: Feature) => {
    const response = await post(`api/stripe/delete_account_feature`, {
      feature_id: feature.id,
    })
    queryClient.invalidateQueries(['accountFeatures'])
    queryClient.invalidateQueries(['accountState'])
    queryClient.invalidateQueries(['customerFeatures'])
    queryClient.invalidateQueries(['productState'])
    queryClient.invalidateQueries(['subscriptionsState'])
    return response
  })

  return (
    <FocusView title={'Features'} shown={shown} setShown={setShown}>
      {isShowingNewForm ? (
        <Box>
          <FeatureForm
            feature={{
              name: '',
              key: '',
              type: 0,
              value_flag: false,
              value_limit: null,
            }}
            isNew={true}
            save={create}
            cancel={() => setIsShowingNewForm(false)}
          />
        </Box>
      ) : (
        <Box>
          <Box css={{ stack: 'x', alignX: 'end', marginBottom: 'medium' }}>
            <Button
              type="secondary"
              onPress={() => setIsShowingNewForm(!isShowingNewForm)}
            >
              + Create New
            </Button>
          </Box>

          <Box>
            <Accordion>
              {features &&
                features.map((f: any) => (
                  <AccordionItem
                    key={f.key}
                    title={f.name}
                    subtitle={f.key}
                    actions={
                      <>
                        {f.type === FeatureType.Flag ? (
                          <Switch
                            disabled={true}
                            checked={!!f.value_flag}
                            defaultChecked={!!f.value_flag}
                          ></Switch>
                        ) : f.type === FeatureType.Limit ? (
                          <Box css={{ font: 'heading' }}>{f.value_limit}</Box>
                        ) : (
                          <></>
                        )}
                      </>
                    }
                  >
                    <FeatureForm
                      feature={f}
                      isNew={false}
                      save={update}
                      destroy={destroy}
                    />
                  </AccordionItem>
                ))}
            </Accordion>
          </Box>
        </Box>
      )}
    </FocusView>
  )
}

export default FeaturesForm
