import { useEffect, useState } from 'react';
import { IndexTable, LegacyCard, Text, Button, Icon, useIndexResourceState, Badge } from '@shopify/polaris';
import { DeleteIcon, ArrowDownIcon, ArrowUpIcon } from '@shopify/polaris-icons';
import "../routes/styles/battertList.css"

const BatteryOptionTable = ({ selectHarvestValue }) => {

    const [selectBatteryOptions, setSelectBatteryOptions] = useState([]);


    const moveItem = (index, direction) => {
        const reorderedItems = [...selectBatteryOptions];
        const [movedItem] = reorderedItems.splice(index, 1);
        const newIndex = direction === 'up' ? index + 1 : index - 1;
        reorderedItems.splice(newIndex, 0, movedItem);
        setSelectBatteryOptions(reorderedItems);
        console.log("reorderedItems ========= ", reorderedItems);
        saveReorderingItems(reorderedItems)
    };

    const saveReorderingItems = async (reorderedItems) => {
        try {
            const savereorderitmesAPI = await fetch("/api/saveReorderedItmes", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ data: reorderedItems, range: selectHarvestValue, collection: "selectBatteryOptions" })
            });
            const savereorderitmesJSON = await savereorderitmesAPI.json();
            console.log("savereorderitmesJSON ====== ", savereorderitmesJSON);

        } catch (error) {
            console.log("error ====", error);

        }
    }

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
                getBatteryOptionList();
            } else {
                shopify.toast.show('Please select harvest value');
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
                getBatteryOptionList();
            } else {
                shopify.toast.show('Please select harvest value');
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


    const rowMarkup = selectBatteryOptions.map((item, index) => (
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
                        disabled={index === selectBatteryOptions.length - 1}
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
                    resourceName={{ singular: 'product', plural: 'products' }}
                    itemCount={selectBatteryOptions.length}
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
    )
}

export default BatteryOptionTable
