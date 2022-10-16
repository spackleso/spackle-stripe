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
import { Feature, FeatureType } from '../types'
import { useEffect, useState, useCallback } from 'react'
import FeatureForm from './FeatureForm'

const FeaturesForm = ({
  context,
  shown,
  setShown,
}: {
  context: ExtensionContextValue
  shown: boolean
  setShown: (val: boolean) => void
}) => {
  const [features, setFeatures] = useState<Feature[]>([])
  const [isShowingNewForm, setIsShowingNewForm] = useState<boolean>(false)
  const { post } = useApi(context)

  const fetch = useCallback(async () => {
    const response = await post(`api/stripe/get_account_features`, {})
    const data = await response.json()
    setFeatures(data.data)
  }, [post])

  useEffect(() => {
    fetch()
  }, [fetch])

  const update = useCallback(
    async (feature) => {
      await post(`api/stripe/update_account_feature`, feature)
      await fetch()
    },
    [post, fetch],
  )

  const create = useCallback(
    async (feature) => {
      await post(`api/stripe/create_account_feature`, feature)
      await fetch()
      setIsShowingNewForm(false)
    },
    [post, fetch],
  )

  const destroy = useCallback(
    async (feature) => {
      await post(`api/stripe/delete_account_feature`, {
        feature_id: feature.id,
      })
      await fetch()
    },
    [post, fetch],
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
              {features.map((f) => (
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
