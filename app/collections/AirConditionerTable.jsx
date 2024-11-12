import React, { useState, useEffect } from 'react';
import { Button, Card, Select, IndexTable, useIndexResourceState, Text, LegacyCard, SkeletonBodyText, SkeletonDisplayText } from '@shopify/polaris';
import { DeleteIcon, ArrowDownIcon, ArrowUpIcon } from '@shopify/polaris-icons';
import "../routes/styles/settings.css"

const AirConditionerTable = () => {
    const [selectedBTURange, setSelectBTURange] = useState('');
    const [airConditionerproducts, setAirConditionerProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const moveItem = (index, direction) => {
        const reorderedItems = [...airConditionerproducts];
        const [movedItem] = reorderedItems.splice(index, 1);
        const newIndex = direction === 'up' ? index + 1 : index - 1;
        reorderedItems.splice(newIndex, 0, movedItem);
        setAirConditionerProducts(reorderedItems);
        // console.log("reorderedItems ========= ", reorderedItems);
        saveReorderingItems(reorderedItems)
    };

    const handleSelectChange = (e) => {
        setLoading(true)
        setSelectBTURange(e);
    };

    const options = [
        { label: 'Select BTU Range', value: '' },
        { label: '< 10000', value: 'lessThan10000' },
        { label: '10000 - 18000', value: '10000to18000' },
        { label: '> 18000', value: 'greaterThan18000' },
    ];

    const formatDisplayName = (name, limit = 35) => {
        const splitName = name.split(' - ');
        if (splitName.length > 1) {
            return (
                <>
                    {splitName[0]}<br />{splitName[1]}
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

                setLoading(true);
                const airConditionerAPI = await fetch('/api/sendAirConditionerProducts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedBTURange, selected }),
                });

                const airConditionerResponse = await airConditionerAPI.json();
                // console.log('airConditionerResponse ========= ', airConditionerResponse);
                getAirConditionerProducts()

                setLoading(false);
            } else {
                // alert('Please select a BTU range');
                shopify.toast.show('Please select a BTU range');
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
                // console.log("selected ==== ", selected);

                setLoading(true);
                const airConditionerAPI = await fetch('/api/addAirConditionerProducts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ selectedBTURange, selected }),
                });

                const airConditionerResponse = await airConditionerAPI.json();
                // console.log('airConditionerResponse ========= ', airConditionerResponse);
                getAirConditionerProducts()
                setLoading(false);
            } else {
                shopify.toast.show('Please select a BTU rangeeeeeee');
                // alert('Please select a BTU range');
                setLoading(false)
            }
        } catch (error) {
            console.error('Error adding air conditioner products:', error);
            setLoading(false)
        }
    };

    const handleDeleteCollectons = async (id) => {
        try {
            // console.log("Deleting ID ====== ", id);
            setLoading(true)
            const fetchDeletevariantsAPI = await fetch("/api/deleteVariants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, selectedBTURange, productType: 'airConditioner' })
            });

            const response = await fetchDeletevariantsAPI.json();
            // console.log("fetchDeletevariantsAPI response ===== ", response.products);
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

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(airConditionerproducts);

    const saveReorderingItems = async (reorderedItems) => {
        try {
            const savereorderitmesAPI = await fetch("/api/saveReorderedItmes", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ data: reorderedItems, range: selectedBTURange, collection: "airConditionerproducts" })
            });
            const savereorderitmesJSON = await savereorderitmesAPI.json();
            // console.log("savereorderitmesJSON ====== ", savereorderitmesJSON);

        } catch (error) {
            console.log("error ====", error);
        }
    }

    const rowMarkup = airConditionerproducts.map((item, index) => (
        <IndexTable.Row
            id={item.id}
            key={item.id}
            position={index}
        >
            <IndexTable.Cell>
                {item.image && item.image.originalSrc ? (
                    <img src={item.image.originalSrc} alt={item.displayName} width={50} />
                ) : (
                    <span>Image Not Available</span>
                )}
            </IndexTable.Cell>
            <IndexTable.Cell>
                <Text variant="bodyMd" fontWeight="bold" as="span">
                    {item.id.split("/")[4]}
                </Text>
            </IndexTable.Cell>
            <IndexTable.Cell>{item.product?.id.split("/")[4]}</IndexTable.Cell>
            <IndexTable.Cell>{formatDisplayName(item.displayName)}</IndexTable.Cell>
            <IndexTable.Cell>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Move Up Button */}
                    <Button
                        icon={ArrowDownIcon}
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === airConditionerproducts.length - 1}
                        accessibilityLabel="Move item up"
                    />
                    {/* Move Down Button */}
                    <Button
                        icon={ArrowUpIcon}
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === 0}
                        accessibilityLabel="Move item down"
                    />
                    {/* Delete Button */}
                    <Button tone="critical" icon={DeleteIcon} onClick={() => handleDeleteCollectons(item.id)} />
                </div>
            </IndexTable.Cell>
        </IndexTable.Row>
    ));


    return (
        <div className='main-container'>
            <Card sectioned>
                {loading ? (
                    <>
                        <div className="btu-range-actions">
                            <SkeletonDisplayText size="small" />
                        </div>
                        <div className="table-container">
                            <SkeletonDisplayText size="large" />
                            <LegacyCard sectioned>
                                <SkeletonBodyText />
                            </LegacyCard>
                        </div>
                    </>
                ) : (
                    <>
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
                                    resourceName={{ singular: 'product', plural: 'products' }}
                                    itemCount={airConditionerproducts.length}
                                    selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                                    headings={[
                                        { title: 'Image' },
                                        { title: 'ID' },
                                        { title: 'Product ID' },
                                        { title: 'Name' },
                                        { title: 'Actions' },
                                    ]}
                                    selectable={false}
                                >
                                    {rowMarkup}
                                </IndexTable>
                            </LegacyCard>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );


};

export default AirConditionerTable;
