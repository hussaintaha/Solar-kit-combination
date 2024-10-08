import { useEffect, useState } from 'react';
import { IndexTable, LegacyCard, Text, Button, Icon, useIndexResourceState, Badge } from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import "../routes/styles/battertList.css"

const BatteryOptionTable = ({ selectHarvestValue }) => {

    const [selectBatteryOptions, setSelectBatteryOptions] = useState([]);


    const formatDisplayName = (name, limit = 20) => {
        if (name.length > limit) {
            return (
                <>
                    {name.substring(0, limit)}<br />{name.substring(limit)}
                </>
            );
        }
        return name;
    };

    const sendBatteryOptionsList = async () => {
        try {
            if (selectHarvestValue) {
                const selected = await shopify.resourcePicker({
                    type: 'variant',
                    multiple: true,
                });


                const batteryListAPI = await fetch('/api/sendBatteryOptionsList', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectHarvestValue, selected }),
                });

                const batteryListResponse = await batteryListAPI.json();
                console.log('batteryListResponse:', batteryListResponse);
                setSelectBatteryOptions(batteryListResponse?.products || []);
            }
        } catch (error) {
            console.error('Error fetching Battery List:', error);
        }
    }

    const getBatteryOptionList = async () => {
        try {
            const response = await fetch(`/api/getBatteryOptionsList/?selectHarvestValue=${selectHarvestValue}`);
            const result = await response.json();
            console.log("result ===== ", result);

            setSelectBatteryOptions(result?.getVariants?.products || []);
        } catch (error) {
            console.error('Error fetching air conditioner products:', error);
        }
    }

    const addBatteryListproducts = async () => {
        try {
            if (selectHarvestValue) {
                const selected = await shopify.resourcePicker({
                    type: 'variant',
                    multiple: true,
                });

                const airConditionerAPI = await fetch('/api/addBatteryListproducts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectHarvestValue, selected }),
                });

                const solarPanelResponse = await airConditionerAPI.json();
                console.log('solarPanelResponse ========= ', solarPanelResponse);
            } else {
                alert('Please select a Harvest value');
            }
        } catch (error) {
            console.error('Error adding air conditioner products:', error);
        }
    };

    const handleDeleteCollectons = async (id) => {
        console.log("Deleting ID ====== ", id);

        const fetchDeletevariantsAPI = await fetch("/api/deleteVariants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, selectHarvestValue, productType: 'battery' })
        });

        const response = await fetchDeletevariantsAPI.json();
        console.log("fetchDeletevariantsAPI response ===== ", response.products);
        setSelectBatteryOptions(response.products);
    };


    useEffect(() => {
        if (selectHarvestValue) {
            getBatteryOptionList();
        }
    }, [selectHarvestValue]);

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(selectBatteryOptions);


    const rowMarkup = selectBatteryOptions.map(
        (
            { id, image, product, displayName }, index,
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <img src={image?.originalSrc} alt={displayName} width={50} />
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {id?.split("/")[4]}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{product?.id?.split("/")[4]}</IndexTable.Cell>
                <IndexTable.Cell>{formatDisplayName(displayName, 20)}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Button tone='critical' onClick={() => handleDeleteCollectons(id)}>
                        <Icon source={DeleteIcon} tone='critical' />
                    </Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <div className='battery-option-container'>
            <div className='battery-option-header'>
                <Text variant="headingXl" as="h4">
                    Battery Options List
                </Text>

                <div className='battery-option-buttons action-buttons'>
                    <Button primary onClick={sendBatteryOptionsList}>Select products</Button>
                    <Button onClick={addBatteryListproducts}>Add Products</Button>
                </div>
            </div>

            <LegacyCard className="index-table-wrapper">
                <IndexTable
                    resourceName={resourceName}
                    itemCount={selectBatteryOptions.length}
                    selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={[
                        { title: 'Image' },
                        { title: 'VariantID' },
                        { title: 'Product ID' },
                        { title: 'Display Name' },
                        { title: "Actions" }
                    ]}
                >
                    {rowMarkup}
                </IndexTable>
            </LegacyCard>
        </div>
    )
}

export default BatteryOptionTable
