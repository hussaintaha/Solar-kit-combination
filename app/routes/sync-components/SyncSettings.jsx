import {
  Button,
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
  TextField,
  EmptyState,
  Spinner,
  Page,
} from "@shopify/polaris";
import React, { useState, useEffect } from "react";
import "../styles/syncSettings.css";
import SyncList from "./SyncList";

const SyncSettings = () => {
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [upcCode, setUpcCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loadList, setLoadList] = useState(false);

  const resourcePicker = async () => {
    try {
      setLoading(true);
      const selected = await shopify.resourcePicker({
        type: "variant",
        action: "select",
        multiple: false,
      });
      console.log("selected variants: ", selected);
      setSelectedVariants(selected);
    } catch (error) {
      console.error("Error in resourcePicker:", error);
    } finally {
      setLoading(false);
    }
  };

  const resourceName = {
    singular: "variant",
    plural: "variants",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(selectedVariants);

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

  const handleUpcCode = (value, index) => {
    setUpcCodes((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const SaveVariantInList = async (item, index) => {
    try {
      console.log("item ==== ", item);
      const code = upcCode[index];
      console.log(upcCode[index]);

      if (!code) {
        return shopify.toast.show("Please enter code before save");
      }

      const saveSyncVariants = await fetch("/api/saveSyncVariants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item, code }),
      });

      const saveSyncResponse = await saveSyncVariants.json();

      if (saveSyncResponse.status) {
        setLoadList(true);
        setSelectedVariants([]);
        setUpcCodes([]);
      }
      console.log("saveSyncResponse ==== ", saveSyncResponse);
    } catch (error) {
      console.log("error in SaveVariantInList", error);
      return error;
      ``;
    }
  };

  const rowMarkup = selectedVariants.map((item, index) => (
    <IndexTable.Row id={item.id} key={item.id} position={index}>
      <IndexTable.Cell className="variant-image">
        {item.image?.originalSrc ? (
          <img
            src={item.image.originalSrc}
            alt={item.displayName}
            style={{ maxWidth: "50px", maxHeight: "50px" }}
          />
        ) : (
          <Text variant="bodyMd" color="subdued">
            Image Not Available
          </Text>
        )}
      </IndexTable.Cell>

      <IndexTable.Cell className="title-variant">
        {formatDisplayName(item?.displayName)}/{item.title}
      </IndexTable.Cell>

      <IndexTable.Cell>
        <Badge status={item.inventoryQuantity > 0 ? "success" : "warning"}>
          {item.inventoryQuantity}
        </Badge>
      </IndexTable.Cell>

      <IndexTable.Cell className="upc-code">
        <TextField
          placeholder="Enter UPC"
          onChange={(value) => handleUpcCode(value, index)}
          value={upcCode[index] || ""}
        />
      </IndexTable.Cell>

      <IndexTable.Cell className="">
        <Button
          variant="primary"
          onClick={() => SaveVariantInList(item, index)}
        >
          {" "}
          Save{" "}
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      <Page fullWidth>
        <div className="resource-picker-btn">
          {selectedVariants.length > 0 && (
            <Button
              variant="primary"
              onClick={resourcePicker}
              loading={loading}
            >
              {loading ? "Loading..." : "Select Variants"}
            </Button>
          )}
        </div>

        {selectedVariants.length === 0 ? (
          <LegacyCard sectioned>
            <EmptyState
              heading="No variants selected"
              image="https://cdn.shopify.com/s/files/1/0265/9222/5082/files/empty-state-icon.svg"
              imageAccessibilityLabel="Empty state"
              action={{
                content: "Select Variants",
                onAction: resourcePicker,
              }}
              description="You haven't selected any variants yet. Please select variants to sync."
            />
          </LegacyCard>
        ) : (
          <LegacyCard sectioned>
            <IndexTable
              resourceName={resourceName}
              itemCount={selectedVariants.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              headings={[
                { title: "Image" },
                { title: "Name" },
                { title: "Inventory Quantity" },
                { title: "UPC Code" },
                { title: "Action" },
              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
          </LegacyCard>
        )}
      </Page>

      <div className="sync-list-continer">
        <SyncList loadList={loadList} setLoadList={setLoadList} />
      </div>
    </>
  );
};

export default SyncSettings;
