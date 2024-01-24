import {
  Button,
  Box,
  FocusView,
  Accordion,
  AccordionItem,
  Switch,
  Inline,
  Link,
  Icon,
} from '@stripe/ui-extension-sdk/ui'
import useApi from '../hooks/useApi'
import { Feature, FeatureType, NewFeature } from '../types'
import { useState } from 'react'
import FeatureForm from './FeatureForm'
import useAccountFeatures from '../hooks/useAccountFeatures'
import { queryClient } from '../query'
import useStripeContext from '../hooks/useStripeContext'
import { useMutation } from '@tanstack/react-query'
import { sortFeatures } from '../utils'

const FeaturesForm = ({
  shown,
  setShown,
}: {
  shown: boolean
  setShown: (val: boolean) => void
}) => {
  const { userContext } = useStripeContext()
  const [isShowingNewForm, setIsShowingNewForm] = useState<boolean>(false)
  const { data: features, isLoading } = useAccountFeatures(
    userContext.account.id,
  )
  const { post } = useApi()

  const update = useMutation({
    mutationFn: async (feature: Feature | NewFeature) => {
      const response = await post(`/stripe/update_account_feature`, feature)
      if (response.status !== 200) {
        const error = (await response.json()).error
        throw new Error(error)
      }

      queryClient.invalidateQueries({ queryKey: ['accountFeatures'] })
      queryClient.invalidateQueries({ queryKey: ['accountState'] })
      queryClient.invalidateQueries({ queryKey: ['customerFeatures'] })
      queryClient.invalidateQueries({ queryKey: ['productState'] })
      queryClient.invalidateQueries({ queryKey: ['subscriptionsState'] })
      return response
    },
  })

  const create = useMutation({
    mutationFn: async (feature: NewFeature | Feature) => {
      const response = await post(`/stripe/create_account_feature`, feature)
      if (response.status !== 201) {
        const error = (await response.json()).error
        throw new Error(error)
      }

      queryClient.invalidateQueries({ queryKey: ['accountFeatures'] })
      queryClient.invalidateQueries({ queryKey: ['accountState'] })
      queryClient.invalidateQueries({ queryKey: ['customerFeatures'] })
      queryClient.invalidateQueries({ queryKey: ['productState'] })
      queryClient.invalidateQueries({ queryKey: ['subscriptionsState'] })
      setIsShowingNewForm(false)
      return response
    },
  })

  const destroy = useMutation({
    mutationFn: async (feature: Feature) => {
      const response = await post(`/stripe/delete_account_feature`, {
        feature_id: feature.id,
      })
      queryClient.invalidateQueries({ queryKey: ['accountFeatures'] })
      queryClient.invalidateQueries({ queryKey: ['accountState'] })
      queryClient.invalidateQueries({ queryKey: ['customerFeatures'] })
      queryClient.invalidateQueries({ queryKey: ['productState'] })
      queryClient.invalidateQueries({ queryKey: ['subscriptionsState'] })
      return response
    },
  })

  return (
    <FocusView
      title={'Features'}
      shown={shown}
      setShown={(val) => {
        if (!val) {
          setIsShowingNewForm(false)
        }
        setShown(val)
      }}
    >
      {isShowingNewForm ? (
        <Box>
          <Link onPress={() => setIsShowingNewForm(false)}>
            <Icon name="arrowLeft" size="xsmall"></Icon> Back to features list
          </Link>
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
            {features?.length ? (
              <Accordion>
                {features &&
                  features.sort(sortFeatures).map((f: any) => (
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
                            <Box css={{ font: 'heading' }}>
                              {f.value_limit === null ? '∞' : f.value_limit}
                            </Box>
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
                        isLoading={isLoading}
                      />
                    </AccordionItem>
                  ))}
              </Accordion>
            ) : (
              <Box
                css={{
                  keyline: 'neutral',
                  padding: 'medium',
                  font: 'caption',
                  borderRadius: 'small',
                  margin: 'xxlarge',
                  textAlign: 'center',
                }}
              >
                You don&apos;t have any features yet. Create a new feature by
                clicking{' '}
                <Inline css={{ fontWeight: 'bold' }}>
                  &quot;Create New&quot;
                </Inline>{' '}
                above
              </Box>
            )}
          </Box>
        </Box>
      )}
    </FocusView>
  )
}

export default FeaturesForm
