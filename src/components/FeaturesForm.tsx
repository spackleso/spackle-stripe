import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import {
  Button,
  Box,
  FocusView,
  Accordion,
  AccordionItem,
  Switch,
} from '@stripe/ui-extension-sdk/ui'
import useApi from '../hooks/useApi'
import { FeatureType } from '../types'
import { useState, useCallback } from 'react'
import FeatureForm from './FeatureForm'
import useAccountFeatures from '../hooks/useAccountFeatures'
import { queryClient } from '../query'

const FeaturesForm = ({
  context,
  shown,
  setShown,
}: {
  context: ExtensionContextValue
  shown: boolean
  setShown: (val: boolean) => void
}) => {
  const [isShowingNewForm, setIsShowingNewForm] = useState<boolean>(false)
  const { data: features } = useAccountFeatures(
    context,
    context.userContext.account.id,
  )
  const { post } = useApi(context)

  const update = useCallback(
    async (feature) => {
      await post(`api/stripe/update_account_feature`, feature)
      queryClient.invalidateQueries(['accountFeatures'])
      queryClient.invalidateQueries(['accountState'])
      queryClient.invalidateQueries(['customerFeatures'])
      queryClient.invalidateQueries(['productState'])
      queryClient.invalidateQueries(['subscriptionsState'])
    },
    [post],
  )

  const create = useCallback(
    async (feature) => {
      await post(`api/stripe/create_account_feature`, feature)
      queryClient.invalidateQueries(['accountFeatures'])
      queryClient.invalidateQueries(['accountState'])
      queryClient.invalidateQueries(['customerFeatures'])
      queryClient.invalidateQueries(['productState'])
      queryClient.invalidateQueries(['subscriptionsState'])
      setIsShowingNewForm(false)
    },
    [post],
  )

  const destroy = useCallback(
    async (feature) => {
      await post(`api/stripe/delete_account_feature`, {
        feature_id: feature.id,
      })
      queryClient.invalidateQueries(['accountFeatures'])
      queryClient.invalidateQueries(['accountState'])
      queryClient.invalidateQueries(['customerFeatures'])
      queryClient.invalidateQueries(['productState'])
      queryClient.invalidateQueries(['subscriptionsState'])
    },
    [post],
  )

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
