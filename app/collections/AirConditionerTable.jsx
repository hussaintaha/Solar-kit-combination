import React, { useState, useEffect } from 'react';
import { Button, Card, Page, Select, IndexTable, useIndexResourceState, Text, Badge, LegacyCard } from '@shopify/polaris';
import "../routes/styles/settings.css"

const AirConditionerTable = () => {
    const [selectedBTURange, setSelectBTURange] = useState('');
    const [previouslySelectedIds, setPreviouslySelectedIds] = useState([]);
    const [airConditionerproducts, setAirConditionerProducts] = useState([]);


    const handleSelectChange = (e) => {
        setSelectBTURange(e);
    };

    const options = [
        { label: 'Select BTU Range', value: '' },
        { label: '< 10000', value: 'lessThan10000' },
        { label: '10000 - 18000', value: '10000to18000' },
        { label: '> 18000', value: 'greaterThan18000' },
    ];

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

    const sendAirConditonerProduct = async () => {
        try {
            if (selectedBTURange) {
                const selected = await shopify.resourcePicker({
                    type: 'variant',
                    multiple: true,
                    // selectionIds: previouslySelectedIds,
                });
                const newSelectedIds = selected.map((product) => ({
                    id: product.id,
                    variants: product.variants ? product.variants.map((variant) => ({ id: variant.id })) : [],
                }));
                setPreviouslySelectedIds(newSelectedIds);

                const airConditionerAPI = await fetch('/api/sendAirConditionerProducts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedBTURange, selected }),
                });

                const airConditionerResponse = await airConditionerAPI.json();
                console.log('airConditionerResponse ========= ', airConditionerResponse);
            } else {
                alert('Please select a BTU range');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getAirConditionerProducts = async () => {
        try {
            const response = await fetch(`/api/getAirConditionerProducts/?selectedBTURange=${selectedBTURange}`);
            const result = await response.json();
            setAirConditionerProducts(result?.getVariants?.products || []);
        } catch (error) {
            console.error('Error fetching air conditioner products:', error);
        }
    };


    const addAirConditionerProducts = async () => {
        try {
            if (selectedBTURange) {
                const selected = await shopify.resourcePicker({
                    type: 'variant',
                    multiple: true,
                    // selectionIds: previouslySelectedIds,
                });
                const newSelectedIds = selected.map((product) => ({
                    id: product.id,
                    variants: product.variants ? product.variants.map((variant) => ({ id: variant.id })) : [],
                }));
                setPreviouslySelectedIds(newSelectedIds);

                const airConditionerAPI = await fetch('/api/addAirConditionerProducts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedBTURange, selected }),
                });

                const airConditionerResponse = await airConditionerAPI.json();
                console.log('airConditionerResponse ========= ', airConditionerResponse);
            } else {
                alert('Please select a BTU range');
            }
        } catch (error) {
            console.error('Error fetching air conditioner products:', error);
        }
    };

    console.log("airConditionerproducts ====== ", airConditionerproducts);

    useEffect(() => {
        if (selectedBTURange) {
            getAirConditionerProducts()
        }
    }, [selectedBTURange])


    const resourceName = { singular: 'product', plural: 'products' };

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(airConditionerproducts);

    const rowMarkup = airConditionerproducts.map(({ id, image, product, displayName }, index) => (
        <IndexTable.Row id={id} key={id} selected={selectedResources.includes(id)} position={index}>
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
        </IndexTable.Row>
    ));

    return (
        <Card sectioned >
            {/* BTU Range Selector */}
            <div className="btu-range-selector">
                <Select label="BTU Range" options={options} onChange={handleSelectChange} value={selectedBTURange} />
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <Button primary onClick={sendAirConditonerProduct}>
                    Select Products
                </Button>
                <Button onClick={addAirConditionerProducts}>Add Products</Button>
            </div>

            <div>
                <Text variant="heading2xl" as="h3">
                    Air Conditioner Variants List
                </Text>
            </div>

            {/* Products Table */}
            {airConditionerproducts.length > 0 && (
                <LegacyCard title="Selected Products" sectioned>
                    <IndexTable
                        resourceName={resourceName}
                        itemCount={airConditionerproducts.length}
                        selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                        onSelectionChange={handleSelectionChange}
                        headings={[
                            { title: 'Image' },
                            { title: 'VariantID' },
                            { title: 'Product ID' },
                            { title: 'Display Name' },
                        ]}
                    >
                        {rowMarkup}
                    </IndexTable>
                </LegacyCard>
            )}
        </Card>
    );
};

export default AirConditionerTable;
