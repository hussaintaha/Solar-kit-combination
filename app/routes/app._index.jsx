import {
  Page,
  Button,
  Layout,
  Card,
  Select
} from "@shopify/polaris";
import { useState, useCallback } from 'react';

export default function Index() {
  const [selectedBTURange, setSelectBTURange] = useState('today');

  const handleSelectChange = useCallback(
    (value) => setSelectBTURange(value),
    [],
  );

  const options = [
    { label: '10000', value: '10000' },
    { label: '18000', value: '18000' },
  ];

  let previouslySelectedIds = [];

  async function selectproducts() {
    const selected = await shopify.resourcePicker({ type: 'variant', multiple: true, selectionIds: previouslySelectedIds });
    console.log("selected ===== ", selected);

    previouslySelectedIds = selected.map(product => ({
      id: product.id,
      variants: product.variants ? product.variants.map(variant => ({
        id: variant.id
      })) : []
    }));

    console.log("Previously selected IDs: ", previouslySelectedIds);
  }




  return (
    <Page>
      <Card>
        <Layout>

          <Layout.Section>
            <div className="btu-range">
              <Select
                label="BTU range"
                options={options}
                onChange={handleSelectChange}
                value={selectedBTURange}
              />
            </div>
          </Layout.Section>

          <Layout.Section>
            <Button onClick={selectproducts}> Select Products </Button>
          </Layout.Section>
        </Layout>
      </Card>
    </Page>
  );
}
