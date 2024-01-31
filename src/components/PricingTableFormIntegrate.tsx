import React from 'react'
import {
  Box,
  Button,
  Icon,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextArea,
  TextField,
} from '@stripe/ui-extension-sdk/ui'
import { PricingTable } from '../types'
import { clipboardWriteText, showToast } from '@stripe/ui-extension-sdk/utils'

type PricingTableFormIntegrateProps = {
  pricingTable: PricingTable
  secretToken: string | null
  publishableToken: string | null
}

const PricingTableFormIntegrate: React.FC<PricingTableFormIntegrateProps> = ({
  pricingTable,
  secretToken,
  publishableToken,
}: PricingTableFormIntegrateProps) => {
  const curlCode = `
curl https://api.spackle.so/v1/pricing_tables/${pricingTable.id} \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer ${publishableToken ? publishableToken : '<PUBLISHABLE_TOKEN>'}'
`.trim()

  const browserCode = `
fetch('https://api.spackle.so/v1/pricing_tables/${pricingTable.id}', {
    headers: {
        Authorization: 'Bearer ${publishableToken ? publishableToken : '<PUBLISHABLE_TOKEN>'}',
    }
})
`.trim()

  const nodeCode = `
// Warning this uses your secret token, do not share this with anyone!
import Spackle from 'spackle-node';
const spackle = new Spackle('${secretToken ? secretToken : '<SECRET_TOKEN>'}')
await spackle.pricingTables.retrieve('${pricingTable.id}')
`.trim()

  const phpCode = `
<?php
// Warning this uses your secret token, do not share this with anyone!
require_once('vendor/autoload.php');
\\Spackle\\Spackle::setApiKey('${secretToken ? secretToken : '<SECRET_TOKEN>'}');
\\Spackle\\PricingTable::retrieve('${pricingTable.id}');
?>
`.trim()

  const pythonCode = `
# Warning this uses your secret token, do not share this with anyone!
import spacklek
spackle.api_key = '${secretToken ? secretToken : '<SECRET_TOKEN>'}'
spackle.PricingTable.retrieve('${pricingTable.id}')
`.trim()

  const rubyCode = `
# Warning this uses your secret token, do not share this with anyone!
require 'spackle'
Spackle.api_key = "${secretToken ? secretToken : '<SECRET_TOKEN>'}"
Spackle::PricingTable.retrieve('${pricingTable.id}')
`.trim()

  return (
    <Box>
      <Box css={{ font: 'heading' }}>Integrate</Box>
      <Box
        css={{
          font: 'caption',
          color: 'secondary',
          marginBottom: 'medium',
        }}
      >
        Use the Spackle SDKs to retrieve your pricing table. Read the docs for
        full integration details.
      </Box>
      <Box
        css={{
          stack: 'x',
          alignY: 'bottom',
          gapX: 'small',
          marginY: 'small',
        }}
      >
        <TextField
          disabled
          value={pricingTable.id}
          label="Table ID"
          size="small"
        />
        <Button
          size="small"
          onPress={async () => {
            await clipboardWriteText(pricingTable.id)
            showToast('Copied to clipboard')
          }}
        >
          <Icon name="clipboard" />
        </Button>
      </Box>
      {secretToken && publishableToken ? (
        <Tabs size="small">
          <TabList>
            <Tab tabKey="curl">cURL</Tab>
            <Tab tabKey="browser">Browser</Tab>
            <Tab tabKey="nodejs">Node.js</Tab>
            <Tab tabKey="php">PHP</Tab>
            <Tab tabKey="python">Python</Tab>
            <Tab tabKey="ruby">Ruby</Tab>
          </TabList>
          <TabPanels>
            <TabPanel tabKey="curl">
              <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                <TextArea
                  defaultValue={curlCode}
                  disabled={true}
                  resizeable={false}
                  rows={3}
                  wrap="off"
                />
                <Button
                  onPress={async () => {
                    await clipboardWriteText(curlCode)
                    showToast('Copied to clipboard')
                  }}
                >
                  <Icon name="clipboard" />
                  Copy
                </Button>
              </Box>
            </TabPanel>
            <TabPanel tabKey="browser">
              <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                <TextArea
                  defaultValue={browserCode}
                  disabled={true}
                  resizeable={false}
                  rows={5}
                  wrap="off"
                />
                <Button
                  onPress={async () => {
                    await clipboardWriteText(browserCode)
                    showToast('Copied to clipboard')
                  }}
                >
                  <Icon name="clipboard" />
                  Copy
                </Button>
              </Box>
            </TabPanel>
            <TabPanel tabKey="nodejs">
              <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                <TextArea
                  defaultValue={nodeCode}
                  disabled={true}
                  resizeable={false}
                  rows={4}
                  wrap="off"
                />
                <Button
                  onPress={async () => {
                    await clipboardWriteText(nodeCode)
                    showToast('Copied to clipboard')
                  }}
                >
                  <Icon name="clipboard" />
                  Copy
                </Button>
              </Box>
            </TabPanel>
            <TabPanel tabKey="php">
              <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                <TextArea
                  defaultValue={phpCode}
                  disabled={true}
                  resizeable={false}
                  rows={6}
                  wrap="off"
                />
                <Button
                  onPress={async () => {
                    await clipboardWriteText(phpCode)
                    showToast('Copied to clipboard')
                  }}
                >
                  <Icon name="clipboard" />
                  Copy
                </Button>
              </Box>
            </TabPanel>
            <TabPanel tabKey="python">
              <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                <TextArea
                  defaultValue={pythonCode}
                  disabled={true}
                  resizeable={false}
                  rows={4}
                  wrap="off"
                />
                <Button
                  onPress={async () => {
                    await clipboardWriteText(pythonCode)
                    showToast('Copied to clipboard')
                  }}
                >
                  <Icon name="clipboard" />
                  Copy
                </Button>
              </Box>
            </TabPanel>
            <TabPanel tabKey="ruby">
              <Box css={{ paddingY: 'small', stack: 'y', gapY: 'small' }}>
                <TextArea
                  defaultValue={rubyCode}
                  disabled={true}
                  resizeable={false}
                  rows={4}
                  wrap="off"
                />
                <Button
                  onPress={async () => {
                    await clipboardWriteText(rubyCode)
                    showToast('Copied to clipboard')
                  }}
                >
                  <Icon name="clipboard" />
                  Copy
                </Button>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <Box
          css={{
            stack: 'x',
            alignX: 'center',
            alignY: 'center',
            width: 'fill',
            height: 'fill',
          }}
        >
          <Spinner />
        </Box>
      )}
    </Box>
  )
}

export default PricingTableFormIntegrate
