import {
  ContextView,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  TableHead,
  TableHeaderCell,
  Box,
  Button,
  TextField,
  Link,
  Icon,
  List,
  ListItem,
} from '@stripe/ui-extension-sdk/ui'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { useEffect, useState } from 'react'
import BrandIcon from './brand_icon.svg'
import useApi from '../hooks/useApi'
import { Feature, FeatureType } from '../types'
import FeaturesForm from '../components/FeaturesForm'

const Customer = (context: ExtensionContextValue) => {
  const [features, setFeatures] = useState<Feature[]>([])
  const { post } = useApi(context)
  const [isShowingFeaturesForm, setIsShowingFeaturesForm] = useState(false)

  useEffect(() => {
    const customerId = context.environment.objectContext?.id
    post(`api/stripe/get_customer_features`, {
      customer_id: customerId,
    }).then((res) => res.json().then((data) => setFeatures(data.data)))
  }, [post, context.environment.objectContext?.id])

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
      primaryAction={
        <>
          <Button type="primary" disabled={true}>
            Save
          </Button>
        </>
      }
      secondaryAction={
        <>
          <Button disabled={true}>Cancel</Button>
        </>
      }
    >
      <List>
        {features.map((f) => (
          <ListItem
            id={f.key}
            key={f.key}
            title={f.name}
            secondaryTitle={f.key}
            size="large"
            value={
              <>
                {f.type === FeatureType.Flag ? (
                  <Switch value={f.value_flag!.toString()}></Switch>
                ) : f.type === FeatureType.Limit ? (
                  <TextField
                    type="number"
                    value={f.value_limit!.toString()}
                  ></TextField>
                ) : (
                  <></>
                )}
              </>
            }
          ></ListItem>
        ))}
      </List>
      <FeaturesForm
        context={context}
        shown={isShowingFeaturesForm}
        setShown={setIsShowingFeaturesForm}
      />
    </ContextView>
  )
}

export default Customer
