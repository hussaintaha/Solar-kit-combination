import { useEffect, useState } from 'react';
import { IndexTable, LegacyCard, Text, Button, Icon, useIndexResourceState } from '@shopify/polaris';
import { DeleteIcon, ArrowDownIcon, ArrowUpIcon } from '@shopify/polaris-icons';
import "../routes/styles/chargeController.css"

const ChargeControllerTable = ({ selectHarvestValue }) => {

    const [chargeControllerProducts, setChargeControllerProducts] = useState([]);

    const moveItem = (index, direction) => {
        const reorderedItems = [...chargeControllerProducts];
        const [movedItem] = reorderedItems.splice(index, 1);
        const newIndex = direction === 'up' ? index + 1 : index - 1;
        reorderedItems.splice(newIndex, 0, movedItem);
        setChargeControllerProducts(reorderedItems);
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
                body: JSON.stringify({ data: reorderedItems, range: selectHarvestValue, collection: "chargeControllerProducts" })
            });
            const savereorderitmesJSON = await savereorderitmesAPI.json();
            console.log("savereorderitmesJSON ====== ", savereorderitmesJSON);

        } catch (error) {
            console.log("error ====", error);

        }
    }

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
                getChargeControllerProducts();
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
                getChargeControllerProducts();
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

    const handleDeleteCollectons = async (id) => {
        console.log("Deleting ID ====== ", id);

        const fetchDeletevariantsAPI = await fetch("/api/deleteVariants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, selectHarvestValue, productType: 'chargeController' })
        });

        const response = await fetchDeletevariantsAPI.json();
        console.log("fetchDeletevariantsAPI response ===== ", response.products);
        setChargeControllerProducts(response.products);
    };



    useEffect(() => {
        if (selectHarvestValue) {
            getChargeControllerProducts();
        }
    }, [selectHarvestValue]);

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };


    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(chargeControllerProducts);


    const rowMarkup = chargeControllerProducts.map((item, index) => (
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
                        disabled={index === chargeControllerProducts.length - 1}
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
        <div className='charge-controller-container'>
            <div className='charge-controller-header'>
                <Text variant="headingLg" as="h5">
                    Charge Controller List
                </Text>
                <div className='charge-controller-buttons action-buttons'>
                    <Button primary onClick={sendChargeControllerProduct}>Select products</Button>
                    <Button onClick={addChargeControllerProducts}>Add Products</Button>
                </div>
            </div>

            <LegacyCard className="index-table-wrapper">
                <IndexTable
                    resourceName={{ singular: 'product', plural: 'products' }}
                    itemCount={chargeControllerProducts.length}
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
    );

}

export default ChargeControllerTable
