import { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  Box,
  FocusView,
} from '@stripe/ui-extension-sdk/ui'
import useApi from '../hooks/useApi'
import { Feature, FeatureType } from '../types'
import { useEffect, useState } from 'react'

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
  const { post } = useApi(context)

  useEffect(() => {
    const fetch = async () => {
      const response = await post(`api/stripe/get_account_features`, {})
      const data = await response.json()
      setFeatures(data.data)
    }
    fetch()
  }, [post, context.environment.objectContext?.id])

  return (
    <FocusView title={'Features'} shown={shown} setShown={setShown}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Default Value</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((f) => (
            <TableRow key={f.id}>
              <TableCell>
                <Box>
                  <Box css={{ font: 'bodyEmphasized' }}>{f.name}</Box>
                  <Box css={{ font: 'body' }}>{f.key}</Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box>{f.type === 0 ? 'Flag' : 'Limit'}</Box>
              </TableCell>
              <TableCell>
                {f.type === FeatureType.Flag ? (
                  <Box>{f.value_flag}</Box>
                ) : f.type === FeatureType.Limit ? (
                  <Box>{f.value_limit}</Box>
                ) : (
                  <></>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FocusView>
  )
}

export default FeaturesForm
