import { useEffect, useState } from "react";
import {
  IndexTable,
  LegacyCard,
  Text,
  Button,
  useIndexResourceState,
  SkeletonDisplayText,
  SkeletonBodyText,
} from "@shopify/polaris";
import { DeleteIcon, ArrowDownIcon, ArrowUpIcon } from "@shopify/polaris-icons";
import "../routes/styles/battertList.css";

const BatteryOptionTable = ({ selectHarvestValue }) => {
  const [selectBatteryOptions, setSelectBatteryOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const moveItem = (index, direction) => {
    const reorderedItems = [...selectBatteryOptions];
    const [movedItem] = reorderedItems.splice(index, 1);

    let newIndex;

    if (direction === "up") {
      newIndex = index === reorderedItems.length ? 0 : index + 1;
    } else if (direction === "down") {
      newIndex = index === 0 ? reorderedItems.length : index - 1;
    }

    reorderedItems.splice(newIndex, 0, movedItem);
    setSelectBatteryOptions(reorderedItems);
    saveReorderingItems(reorderedItems);
  };

  const saveReorderingItems = async (reorderedItems) => {
    try {
      const savereorderitmesAPI = await fetch("/api/saveReorderedItmes", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          data: reorderedItems,
          range: selectHarvestValue,
          collection: "selectBatteryOptions",
        }),
      });
      const savereorderitmesJSON = await savereorderitmesAPI.json();
      // console.log("savereorderitmesJSON ====== ", savereorderitmesJSON);
    } catch (error) {
      console.log("error ====", error);
    }
  };

  const formatDisplayName = (name, limit = 35) => {
    const splitName = name.split(" - ");
    if (splitName.length > 1) {
      return (
        <>
          {splitName[0]}
          <br />
          {splitName[1]}
        </>
      );
    }
    return name;
  };

  const sendBatteryOptionsList = async () => {
    try {
      setLoading(true);
      if (selectHarvestValue) {
        const selected = await shopify.resourcePicker({
          type: "variant",
          multiple: true,
        });

        const batteryListAPI = await fetch("/api/selectBatteryOptionsList", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectHarvestValue, selected }),
        });

        const batteryListResponse = await batteryListAPI.json();
        // console.log('batteryListResponse:', batteryListResponse);
        setSelectBatteryOptions(batteryListResponse?.products || []);
        getBatteryOptionList();
        setLoading(false);
      } else {
        shopify.toast.show("Please select harvest value");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Battery List:", error);
      setLoading(false);
    }
  };

  const getBatteryOptionList = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/getBatteryOptionsList/?selectHarvestValue=${selectHarvestValue}`,
      );
      const result = await response.json();
      // console.log("result ===== ", result);

      setSelectBatteryOptions(result?.getVariants?.products || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching air conditioner products:", error);
    }
  };

  const addBatteryListproducts = async () => {
    try {
      setLoading(true);
      if (selectHarvestValue) {
        const selected = await shopify.resourcePicker({
          type: "variant",
          multiple: true,
        });

        const airConditionerAPI = await fetch("/api/addBatteryListproducts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectHarvestValue, selected }),
        });

        const solarPanelResponse = await airConditionerAPI.json();
        console.log("solarPanelResponse ========= ", solarPanelResponse);

        if (solarPanelResponse.success) {
          getBatteryOptionList();
        } else {
          setLoading(false);
          shopify.toast.show(solarPanelResponse.message);
        }
      } else {
        setLoading(false);
        shopify.toast.show("Please select harvest value");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error adding air conditioner products:", error);
    }
  };

  const handleDeleteCollectons = async (id) => {
    try {
      setLoading(true);
      const fetchDeletevariantsAPI = await fetch("/api/deleteVariants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          selectHarvestValue,
          productType: "battery",
        }),
      });

      const response = await fetchDeletevariantsAPI.json();
      // console.log("fetchDeletevariantsAPI response ===== ", response.products);
      setSelectBatteryOptions(response.products);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectHarvestValue) {
      getBatteryOptionList();
    }
  }, [selectHarvestValue]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(selectBatteryOptions);

  const rowMarkup = selectBatteryOptions.map((item, index) => (
    <IndexTable.Row id={item.id} key={item.id} position={index}>
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
      <IndexTable.Cell>{item.price}</IndexTable.Cell>
      <IndexTable.Cell>
        {formatDisplayName(item.displayName)}/{item.title}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Move Up Button */}
          <Button
            icon={ArrowDownIcon}
            onClick={() => moveItem(index, "up")}
            // disabled={index === selectBatteryOptions.length - 1}
            accessibilityLabel="Move item up"
          />
          {/* Move Down Button */}
          <Button
            icon={ArrowUpIcon}
            onClick={() => moveItem(index, "down")}
            // disabled={index === 0}
            accessibilityLabel="Move item down"
          />
          {/* Delete Button */}
          <Button
            tone="critical"
            icon={DeleteIcon}
            onClick={() => handleDeleteCollectons(item.id)}
          />
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <div className="battery-option-container">
      {loading ? (
        <>
          <div className="battery-option-header">
            <SkeletonDisplayText size="large" />
          </div>

          <LegacyCard className="index-table-wrapper">
            <SkeletonBodyText />
          </LegacyCard>
        </>
      ) : (
        <>
          <div className="battery-option-header">
            <Text variant="headingXl" as="h4">
              Battery Options List
            </Text>

            <div className="battery-option-buttons action-buttons">
              <Button primary onClick={sendBatteryOptionsList}>
                Select products
              </Button>
              <Button onClick={addBatteryListproducts}>Add Products</Button>
            </div>
          </div>

          <LegacyCard className="index-table-wrapper">
            <IndexTable
              resourceName={{ singular: "product", plural: "products" }}
              itemCount={selectBatteryOptions.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              headings={[
                { title: "Image" },
                { title: "ID" },
                { title: "Product ID" },
                { title: "price" },
                { title: "Name" },
                { title: "Actions" },
              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
          </LegacyCard>
        </>
      )}
    </div>
  );
};

export default BatteryOptionTable;
