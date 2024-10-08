import { useEffect, useState } from 'react';
import { IndexTable, LegacyCard, Text, Button, Icon, useIndexResourceState } from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import "../routes/styles/chargeController.css"

const ChargeControllerTable = ({ selectHarvestValue }) => {

    const [chargeControllerProducts, setChargeControllerProducts] = useState([]);


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


    const {
        selectedResources: selectedChargeControllerResources,
        allResourcesSelected: allChargeControllerResourcesSelected,
        handleSelectionChange: handleChargeControllerSelectionChange,
    } = useIndexResourceState(chargeControllerProducts);


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
                <div>
                    <IndexTable.Cell>{formatDisplayName(displayName, 20)} </IndexTable.Cell>
                </div>

                <IndexTable.Cell>
                    <Button tone='critical'  onClick={() => handleDeleteCollectons(id)}>
                        <Icon source={DeleteIcon} tone='critical' />
                    </Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

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
                    className="index-table"
                >
                    {chargeControllerRowMarkup}
                </IndexTable>
            </LegacyCard>
        </div>
    );

}

export default ChargeControllerTable
