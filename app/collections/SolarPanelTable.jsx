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

const SolarPanelTable = () => {
    const [selectHarvestValue, setSelectHarvestValue] = useState("");
    const [solarPanelProducts, setSolarPanelProducts] = useState([]);
    const [chargeControllerProducts, setChargeControllerProducts] = useState([]);

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
            console.error('Error adding air conditioner products:', error);
        }
    };

    const getSolarPanelProducts = async () => {
        try {
            const response = await fetch(`/api/getSolarPanelProducts/?selectHarvestValue=${selectHarvestValue}`);
            const result = await response.json();
            setSolarPanelProducts(result?.getVariants?.products || []);
        } catch (error) {
            console.error('Error fetching air conditioner products:', error);
        }
    };







    const sendChargeControllerProduct = async () => {
        if (selectHarvestValue) {
            try {
                const selected = await shopify.resourcePicker({
                    type: 'variant',
                    multiple: true,
                });

                const airConditionerAPI = await fetch('/api/sendChargeControllerProducts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectHarvestValue, selected }),
                });

                const chargeControllerResponse = await airConditionerAPI.json();
                console.log('chargeControllerResponse:', chargeControllerResponse);
                setChargeControllerProducts(chargeControllerResponse?.products || []);

            } catch (error) {
                console.error('Error fetching solar panel products:', error);
            }
        } else {
            alert("Please select harvest value");
        }
    };

    const addChargeControllerProducts = async () => {
        try {
            if (selectHarvestValue) {
                const selected = await shopify.resourcePicker({
                    type: 'variant',
                    multiple: true,
                });

                const airConditionerAPI = await fetch('/api/addChargeControllerProducts', {
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

    const getChargeControllerProducts = async () => {
        try {
            const response = await fetch(`/api/getChargeControllerProducts/?selectHarvestValue=${selectHarvestValue}`);
            const result = await response.json();
            setChargeControllerProducts(result?.getVariants?.products || []);
        } catch (error) {
            console.error('Error fetching air conditioner products:', error);
        }
    }



    useEffect(() => {
        if (selectHarvestValue) {
            getSolarPanelProducts();
            getChargeControllerProducts();
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

    const {
        selectedResources: selectedChargeControllerResources,
        allResourcesSelected: allChargeControllerResourcesSelected,
        handleSelectionChange: handleChargeControllerSelectionChange,
    } = useIndexResourceState(chargeControllerProducts);

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
                    <Button tone='critical' variant='primary' onClick={() => handleDeleteCollectons(id)}>
                        <Icon source={DeleteIcon} tone='critical' />
                    </Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    const chargeControllerRowMarkup = chargeControllerProducts.map(
        ({ id, image, product, displayName }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedChargeControllerResources.includes(id)}
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
                    <Button tone='critical' variant='primary' onClick={() => handleDeleteCollectons(id)}>
                        <Icon source={DeleteIcon} tone='critical' />
                    </Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <Card>
            <div className="harvest-value-selector">
                <Select
                    label="Needed Harvest"
                    options={options}
                    onChange={setSelectHarvestValue}
                    value={selectHarvestValue}
                />
            </div>

            <div>
                <Text variant="heading2xl" as="h3">
                    Solar Panel Variants List
                </Text>
            </div>

            <Button onClick={sendSolarPanelProduct}>Select products</Button>
            <Button onClick={addSolarPanelProducts}>Add Products</Button>

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
                        { title: 'Product ID' },
                        { title: 'Display Name' },
                        { title: "Actions" }
                    ]}
                >
                    {rowMarkup}
                </IndexTable>
            </LegacyCard>

            <div>
                <Text variant="heading2xl" as="h3">
                    Charge Controller Variants List
                </Text>
            </div>

            <Button onClick={sendChargeControllerProduct}>Select products</Button>
            <Button onClick={addChargeControllerProducts}>Add Products</Button>


            <LegacyCard>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={chargeControllerProducts.length}
                    selectedItemsCount={
                        allChargeControllerResourcesSelected ? 'All' : selectedChargeControllerResources.length
                    }
                    onSelectionChange={handleChargeControllerSelectionChange}
                    headings={[
                        { title: 'Image' },
                        { title: 'VariantID' },
                        { title: 'Product ID' },
                        { title: 'Display Name' },
                        { title: "Actions" }
                    ]}
                >
                    {chargeControllerRowMarkup}
                </IndexTable>
            </LegacyCard>
        </Card>
    );
};

export default SolarPanelTable;
