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
          <Link
            onPress={() => setIsShowingFeaturesForm(!isShowingFeaturesForm)}
          >
            <Icon name="settings" />
            Manage Features
          </Link>
        </>
      }
      primaryAction={
        <>
          <Button type="primary">Save</Button>
        </>
      }
      secondaryAction={
        <>
          <Button>Cancel</Button>
        </>
      }
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Feature</TableHeaderCell>
            <TableHeaderCell>Value</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((f) => (
            <TableRow key={f.id}>
              <TableCell>
                <Box>{f.name}</Box>
              </TableCell>
              <TableCell>
                <Box css={{ alignX: 'end' }}>
                  {f.type === FeatureType.Flag ? (
                    <Switch value={f.value_flag!.toString()}></Switch>
                  ) : f.type === FeatureType.Limit ? (
                    <TextField value={f.value_limit!.toString()}></TextField>
                  ) : (
                    <></>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FeaturesForm
        context={context}
        shown={isShowingFeaturesForm}
        setShown={setIsShowingFeaturesForm}
      />
    </ContextView>
  )
}

export default Customer
