import { Card, Select, IndexTable, LegacyCard, useIndexResourceState, Text, Button, SkeletonDisplayText, SkeletonBodyText, } from '@shopify/polaris';
import { DeleteIcon, ArrowDownIcon, ArrowUpIcon } from '@shopify/polaris-icons';
import React, { useEffect, useState } from 'react';
import "../routes/styles/solarPanelproducts.css";
import ChargeControllerTable from './ChargeControllerTable';
import BatteryOptionTable from './BatteryOptionTable';

const SolarPanelTable = () => {
    const [selectHarvestValue, setSelectHarvestValue] = useState("");
    const [solarPanelProducts, setSolarPanelProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const moveItem = (index, direction) => {
        const reorderedItems = [...solarPanelProducts];
        const [movedItem] = reorderedItems.splice(index, 1);
        const newIndex = direction === 'up' ? index + 1 : index - 1;
        reorderedItems.splice(newIndex, 0, movedItem);
        setSolarPanelProducts(reorderedItems);
        // console.log("reorderedItems ========= ", reorderedItems);
        saveReorderingItems(reorderedItems)
    };

    const saveReorderingItems = async (reorderedItems) => {
        try {
            setLoading(true);
            const savereorderitmesAPI = await fetch("/api/saveReorderedItmes", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ data: reorderedItems, range: selectHarvestValue, collection: "solarPanelProducts" })
            });
            const savereorderitmesJSON = await savereorderitmesAPI.json();
            // console.log("savereorderitmesJSON ====== ", savereorderitmesJSON);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log("error ====", error);

        }
    }

    const formatDisplayName = (name, limit = 35) => {
        const splitName = name.split(' - '); // Split the name based on the first hyphen
        if (splitName.length > 1) {
            return (
                <>
                    {splitName[0]}<br />{splitName[1]}
                </>
            );
        }
        return name;
    };

    const sendSolarPanelProduct = async () => {
        if (selectHarvestValue) {
            try {
                setLoading(true);
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
                // console.log("solarPanelResponse ==== ", solarPanelResponse);
                setSolarPanelProducts(solarPanelResponse?.products || []);
                getSolarPanelProducts()
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error fetching solar panel products:', error);
            }
        } else {
            setLoading(false);
            shopify.toast.show('Please select harvest value');
        }
    };

    const addSolarPanelProducts = async () => {
        try {
            setLoading(true);
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
                // console.log('solarPanelResponse ========= ', solarPanelResponse);
                getSolarPanelProducts();
                setLoading(false);
            } else {
                setLoading(false);
                shopify.toast.show('Please select harvest value');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error adding solar panel products:', error);
        }
    };

    const getSolarPanelProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/getSolarPanelProducts/?selectHarvestValue=${selectHarvestValue}`);
            const result = await response.json();
            // console.log("resultSolarPanel ========== ", result);
            setSolarPanelProducts(result?.getVariants?.products || []);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Error fetching solar panel products:', error);
        }
    };

    const handleDeleteCollectons = async (id) => {
        try {
            setLoading(true);
            // console.log("Deleting ID ====== ", id);
            const fetchDeletevariantsAPI = await fetch("/api/deleteVariants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id, selectHarvestValue, productType: 'solarPanel' })
            });

            const response = await fetchDeletevariantsAPI.json();
            // console.log("fetchDeletevariantsAPI response ===== ", response.products);
            setSolarPanelProducts(response.products);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log("error ====== ", error);
        }
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

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(solarPanelProducts);

    const rowMarkup = solarPanelProducts.map((item, index) => (
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
                        disabled={index === solarPanelProducts.length - 1}
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
    ))

    return (
        <div className='main-container'>
            <Card>
                {loading ? (
                    <>
                        <div className='solar-panel-container'>
                            <div className="harvest-value-selector">
                                <SkeletonDisplayText size="medium" />
                            </div>

                            <div className='solar-panel-table common-table'>
                                <div className='soalr-panel-header'>
                                    <SkeletonDisplayText size="small" />
                                    <div className="action-buttons">
                                        <SkeletonBodyText />
                                    </div>
                                </div>

                                <LegacyCard>
                                    <SkeletonBodyText />
                                </LegacyCard>
                            </div>

                            <div className='charge-controller'>
                                <SkeletonBodyText />
                            </div>
                            <div className='battery-option'>
                                <SkeletonBodyText />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
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
                                        resourceName={{ singular: 'product', plural: 'products' }}
                                        itemCount={solarPanelProducts.length}
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

                            <div className='charge-controller'>
                                <ChargeControllerTable selectHarvestValue={selectHarvestValue} />
                            </div>
                            <div className='battery-option'>
                                <BatteryOptionTable selectHarvestValue={selectHarvestValue} />
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );

};

export default SolarPanelTable;
