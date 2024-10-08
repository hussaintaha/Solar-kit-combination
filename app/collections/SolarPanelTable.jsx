import {
    Card,
    Select,
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Button,
    Icon,
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import React, { useEffect, useState } from 'react';
import "../routes/styles/solarPanelproducts.css";
import ChargeControllerTable from './ChargeControllerTable';
import BatteryOptionTable from './BatteryOptionTable';

const SolarPanelTable = () => {
    const [selectHarvestValue, setSelectHarvestValue] = useState("");
    const [solarPanelProducts, setSolarPanelProducts] = useState([]);

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

    const sendSolarPanelProduct = async () => {
        if (selectHarvestValue) {
            try {
                const selected = await shopify.resourcePicker({
                    type: 'variant',
                    multiple: true,
                });

                const airConditionerAPI = await fetch('/api/sendSolarPanelProducts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectHarvestValue, selected }),
                });

                const solarPanelResponse = await airConditionerAPI.json();
                setSolarPanelProducts(solarPanelResponse?.products || []);

            } catch (error) {
                console.error('Error fetching solar panel products:', error);
            }
        } else {
            alert("Please select harvest value");
        }
    };

    const addSolarPanelProducts = async () => {
        try {
            if (selectHarvestValue) {
                const selected = await shopify.resourcePicker({
                    type: 'variant',
                    multiple: true,
                });

                const airConditionerAPI = await fetch('/api/addsolarPanelProducts', {
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
            console.error('Error adding solar panel products:', error);
        }
    };

    const getSolarPanelProducts = async () => {
        try {
            const response = await fetch(`/api/getSolarPanelProducts/?selectHarvestValue=${selectHarvestValue}`);
            const result = await response.json();
            setSolarPanelProducts(result?.getVariants?.products || []);
        } catch (error) {
            console.error('Error fetching solar panel products:', error);
        }
    };

    const handleDeleteCollectons = async (id) => {
        console.log("Deleting ID ====== ", id);

        const fetchDeletevariantsAPI = await fetch("/api/deleteVariants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, selectHarvestValue, productType: 'solarPanel' })
        });

        const response = await fetchDeletevariantsAPI.json();
        console.log("fetchDeletevariantsAPI response ===== ", response.products);
        setSolarPanelProducts(response.products);
    };

    useEffect(() => {
        if (selectHarvestValue) {
            getSolarPanelProducts();
        }
    }, [selectHarvestValue]);

    const options = [
        { label: 'Select Harvest Range', value: '' },
        { label: '< 4 kWh', value: 'lessThan4kWh' },
        { label: '4 - 10 kWh', value: '4to10kWh' },
        { label: '10 - 20 kWh', value: '10to20kWh' },
        { label: '> 20 kWh', value: 'greaterThan20kWh' },
    ];

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const {
        selectedResources: selectedSolarPanelResources,
        allResourcesSelected: allSolarPanelResourcesSelected,
        handleSelectionChange: handleSolarPanelSelectionChange,
    } = useIndexResourceState(solarPanelProducts);

    const rowMarkup = solarPanelProducts.map(
        ({ id, image, product, displayName }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedSolarPanelResources.includes(id)}
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
        <div className='main-container'>
            <Card>
                <div className='solar-panel-container'>
                    <div className="harvest-value-selector">
                        <Select
                            label="Needed Harvest"
                            options={options}
                            onChange={setSelectHarvestValue}
                            value={selectHarvestValue}
                        />
                    </div>

                    <div className='solar-panel-table common-table'>
                        <div className='soalr-panel-header'>
                            <Text variant="headingLg" as="h5">
                                Solar Panel List
                            </Text>

                            <div className="action-buttons">
                                <Button primary onClick={sendSolarPanelProduct}>Select Products</Button>
                                <Button onClick={addSolarPanelProducts}>Add Products</Button>
                            </div>
                        </div>

                        <LegacyCard>
                            <IndexTable
                                resourceName={resourceName}
                                itemCount={solarPanelProducts.length}
                                selectedItemsCount={
                                    allSolarPanelResourcesSelected ? 'All' : selectedSolarPanelResources.length
                                }
                                onSelectionChange={handleSolarPanelSelectionChange}
                                headings={[
                                    { title: 'Image' },
                                    { title: 'VariantID' },
                                    { title: 'ProductID' },
                                    { title: 'Name' },
                                    { title: 'Action' },
                                ]}
                            >
                                {rowMarkup}
                            </IndexTable>
                        </LegacyCard>
                    </div>
                    <div className='charge-controller'>
                        <ChargeControllerTable selectHarvestValue={selectHarvestValue} />
                    </div>
                    <div className='battery-option'>
                        <BatteryOptionTable selectHarvestValue={selectHarvestValue} />
                    </div>
                </div>
            </Card>
        </div>

    );
};

export default SolarPanelTable;
