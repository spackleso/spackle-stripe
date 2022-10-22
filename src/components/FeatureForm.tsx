import {
  Button,
  Box,
  FormFieldGroup,
  TextField,
  Radio,
  Switch,
  Spinner,
} from '@stripe/ui-extension-sdk/ui'
import { Feature, FeatureType, NewFeature } from '../types'
import { useState } from 'react'
import { UseMutationResult } from '@tanstack/react-query'

const FeatureForm = ({
  feature,
  isNew,
  save,
  cancel,
  destroy,
}: {
  feature: Feature | NewFeature
  isNew: boolean
  save: UseMutationResult<any, unknown, Feature | NewFeature, unknown>
  cancel?: () => void
  destroy?: UseMutationResult<any, unknown, Feature, unknown>
}) => {
  const [name, setName] = useState<string>(feature.name)
  const [key, setKey] = useState<string>(feature.key)
  const [type, setType] = useState<number>(feature.type)
  const [valueFlag, setValueFlag] = useState<boolean | null>(feature.value_flag)
  const [valueLimit, setValueLimit] = useState<number | null>(
    feature.value_limit,
  )

  const isEdited =
    name !== feature.name ||
    key !== feature.key ||
    type !== feature.type ||
    valueFlag !== feature.value_flag ||
    valueLimit !== feature.value_limit

  return (
    <Box css={{ padding: 'small', gap: 'small', stack: 'y' }}>
      <TextField
        label="Name"
        required={true}
        description="Name of the feature"
        value={name}
        placeholder="Priority Support"
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Key"
        required={true}
        disabled={!isNew}
        description="Feature key for use by the API"
        value={key}
        placeholder="priority_support"
        onChange={(e) => setKey(e.target.value)}
      />
      <Box css={{ paddingY: 'small' }}>
        <FormFieldGroup>
          <Radio
            label="Flag"
            name={feature.key || 'new'}
            description="A feature that can be enabled or disabled"
            value={FeatureType.Flag}
            defaultChecked={type === FeatureType.Flag}
            disabled={!isNew}
            checked={type === FeatureType.Flag}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (value === FeatureType.Flag) {
                setValueLimit(null)
                setValueFlag(feature.value_flag)
              } else if (value === FeatureType.Limit) {
                setValueLimit(feature.value_limit)
                setValueFlag(null)
              }
              setType(value)
            }}
          />
          <Radio
            label="Limit"
            name={feature.key || 'new'}
            description="A usage based feature that has an upper bound"
            value={FeatureType.Limit}
            defaultChecked={type === FeatureType.Limit}
            disabled={!isNew}
            checked={type === FeatureType.Limit}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (value === FeatureType.Flag) {
                setValueLimit(null)
                setValueFlag(feature.value_flag)
              } else if (value === FeatureType.Limit) {
                setValueLimit(feature.value_limit)
                setValueFlag(null)
              }
              setType(value)
            }}
          />
        </FormFieldGroup>
      </Box>
      <Box>
        {type === FeatureType.Flag ? (
          <Switch
            label="Default Enabled"
            description="This will be the value unless overridden by products, prices, or customers"
            defaultChecked={!!valueFlag}
            checked={!!valueFlag}
            onChange={(e) => setValueFlag(e.target.checked)}
          ></Switch>
        ) : type === FeatureType.Limit ? (
          <TextField
            type="number"
            label="Default Limit"
            description="This will be the value unless overridden by products, prices, or customers"
            value={valueLimit || 0}
            onChange={(e) => setValueLimit(parseInt(e.target.value))}
          ></TextField>
        ) : (
          <></>
        )}
      </Box>
      {save.error && (
        <Box
          css={{ color: 'critical', textAlign: 'center', paddingTop: 'medium' }}
        >
          Something went wrong
        </Box>
      )}
      <Box
        css={{ stack: 'x', paddingY: 'medium', distribute: 'space-between' }}
      >
        <Box css={{ stack: 'x', alignX: 'end', gapX: 'small' }}>
          {!isNew && (
            <Button
              type="destructive"
              disabled={save.isLoading || destroy?.isLoading}
              onPress={() => destroy && destroy.mutate(feature as Feature)}
            >
              {destroy?.isLoading ? <Spinner /> : <>Delete</>}
            </Button>
          )}
        </Box>

        <Box css={{ stack: 'x', alignX: 'end', gapX: 'small' }}>
          {!(save.isLoading || destroy?.isLoading) && (
            <Button
              type="secondary"
              disabled={!isEdited && !isNew}
              onPress={() => {
                setName(feature.name)
                setKey(feature.key)
                setType(feature.type)
                setValueFlag(feature.value_flag)
                setValueLimit(feature.value_limit)
                if (cancel) {
                  cancel()
                }
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            disabled={
              !isEdited ||
              destroy?.isLoading ||
              save.isLoading ||
              key.length === 0 ||
              name.length === 0
            }
            onPress={() =>
              save.mutate({
                ...feature,
                name,
                key,
                type,
                value_flag: valueFlag,
                value_limit: valueLimit,
              })
            }
          >
            {save.isLoading ? <Spinner /> : <>Save</>}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default FeatureForm
