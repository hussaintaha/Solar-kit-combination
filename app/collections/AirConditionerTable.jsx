import React, { useState, useEffect } from 'react';
import { Button, Card, Page, Select, IndexTable, useIndexResourceState, Text, Badge, LegacyCard, Icon, SkeletonBodyText, SkeletonDisplayText } from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import "../routes/styles/settings.css"

const AirConditionerTable = () => {
    const [selectedBTURange, setSelectBTURange] = useState('');
    const [previouslySelectedIds, setPreviouslySelectedIds] = useState([]);
    const [airConditionerproducts, setAirConditionerProducts] = useState([]);
    const [loading, setLoading] = useState(false)

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
                });
                const newSelectedIds = selected.map((product) => ({
                    id: product.id,
                    variants: product.variants ? product.variants.map((variant) => ({ id: variant.id })) : [],
                }));
                setPreviouslySelectedIds(newSelectedIds);

                setLoading(true);
                const airConditionerAPI = await fetch('/api/sendAirConditionerProducts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedBTURange, selected }),
                });

                const airConditionerResponse = await airConditionerAPI.json();
                console.log('airConditionerResponse ========= ', airConditionerResponse);
                setLoading(false);
            } else {
                alert('Please select a BTU range');
                setLoading(false)
            }
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };

    const getAirConditionerProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/getAirConditionerProducts/?selectedBTURange=${selectedBTURange}`);
            const result = await response.json();
            setAirConditionerProducts(result?.getVariants?.products || []);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching air conditioner products:', error);
            setLoading(false)
        }
    };

    const addAirConditionerProducts = async () => {
        try {
            if (selectedBTURange) {
                const selected = await shopify.resourcePicker({
                    type: 'variant',
                    multiple: true,
                });
                const newSelectedIds = selected.map((product) => ({
                    id: product.id,
                    variants: product.variants ? product.variants.map((variant) => ({ id: variant.id })) : [],
                }));
                setPreviouslySelectedIds(newSelectedIds);

                setLoading(true);
                const airConditionerAPI = await fetch('/api/addAirConditionerProducts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedBTURange, selected }),
                });

                const airConditionerResponse = await airConditionerAPI.json();
                console.log('airConditionerResponse ========= ', airConditionerResponse);
                setLoading(false);
            } else {
                alert('Please select a BTU range');
                setLoading(false)
            }
        } catch (error) {
            console.error('Error adding air conditioner products:', error);
            setLoading(false)
        }
    };

    const handleDeleteCollectons = async (id) => {
        try {
            console.log("Deleting ID ====== ", id);
            setLoading(true)
            const fetchDeletevariantsAPI = await fetch("/api/deleteVariants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, selectedBTURange, productType: 'airConditioner' })
            });

            const response = await fetchDeletevariantsAPI.json();
            console.log("fetchDeletevariantsAPI response ===== ", response.products);
            setAirConditionerProducts(response.products);
            setLoading(false)
        } catch (error) {
            console.log("error ==== ", error);
            setLoading(false)
        }
    };

    useEffect(() => {
        if (selectedBTURange) {
            getAirConditionerProducts();
        }
    }, [selectedBTURange]);

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(airConditionerproducts);

    const rowMarkup = airConditionerproducts.map(
        (
            { id, image, product, displayName },
            index,
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
                <div>
                    <IndexTable.Cell>{formatDisplayName(displayName, 20)} </IndexTable.Cell>
                </div>

                <IndexTable.Cell>
                    <Button tone='critical' variant='icon' onClick={() => handleDeleteCollectons(id)}>
                        <Icon source={DeleteIcon} tone='critical' />
                    </Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <div className='main-container'>
            <Card sectioned>
                <div className="btu-range-actions">
                    <Select label="Select BTU Range" options={options} onChange={handleSelectChange} value={selectedBTURange} />
                </div>

                <div className="table-container">
                    <div className="heading-container">
                        <Text variant="headingXl" as="h4">
                            Air Conditioner List
                        </Text>
                        <div className="action-buttons">
                            <Button primary onClick={sendAirConditonerProduct}>Select Products</Button>
                            <Button onClick={addAirConditionerProducts}>Add Products</Button>
                        </div>
                    </div>

                    <LegacyCard sectioned>
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={airConditionerproducts.length}
                            selectedItemsCount={
                                allResourcesSelected ? 'All' : selectedResources.length
                            }
                            onSelectionChange={handleSelectionChange}
                            headings={[
                                { title: 'Image' },
                                { title: 'ID' },
                                { title: 'Product ID' },
                                { title: 'Name' },
                                { title: 'Actions' },
                            ]}
                        >
                            {loading ? (
                                <IndexTable.Row>
                                    <IndexTable.Cell>
                                        <SkeletonBodyText lines={1} />
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        <SkeletonDisplayText size="medium" />
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        <SkeletonDisplayText size="medium" />
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        <SkeletonDisplayText size="medium" />
                                    </IndexTable.Cell>
                                    <IndexTable.Cell>
                                        <SkeletonBodyText lines={1} />
                                    </IndexTable.Cell>
                                </IndexTable.Row>
                            ) : (
                                rowMarkup
                            )}
                        </IndexTable>
                    </LegacyCard>
                </div>
            </Card>
        </div>
    );
};

export default AirConditionerTable;