import {
  IndexTable,
  LegacyCard,
  Text,
  Badge,
  useBreakpoints,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import "../styles/syncSettings.css";

const SyncList = ({ loadList, setLoadList }) => {
  const [list, setList] = useState([]);

  const resourceName = {
    singular: "variant",
    plural: "variants",
  };

  const formatDisplayName = (name) => {
    const splitName = name.split(" - ");
    return splitName.length > 1 ? (
      <>
        {splitName[0]}
        <br />
        {splitName[1]}
      </>
    ) : (
      name
    );
  };

  useEffect(() => {
    const fetchSyncVariants = async () => {
      try {
        const response = await fetch("/api/fetchVariants");
        const result = await response.json();
        console.log("result =================== ", result);

        if (result.status) {
          setList(result.data);
          setLoadList(false);
        } else {
          console.error("Failed to fetch variants.");
        }
      } catch (error) {
        console.error("Error fetching sync variants:", error);
      }
    };

    fetchSyncVariants();
  }, [loadList]);

  const rowMarkup = list.flatMap((item) =>
    item.variants.map((variant) => (
      <IndexTable.Row id={variant.id} key={variant.id}>
        <IndexTable.Cell>
          {variant.image?.originalSrc ? (
            <img
              src={variant.image.originalSrc}
              alt={variant.displayName}
              style={{ maxWidth: "50px", maxHeight: "50px" }}
            />
          ) : (
            <Text variant="bodyMd" color="subdued">
              Image Not Available
            </Text>
          )}
        </IndexTable.Cell>

        <IndexTable.Cell>
          {formatDisplayName(variant.displayName)}
        </IndexTable.Cell>

        <IndexTable.Cell>{item.code}</IndexTable.Cell>

        <IndexTable.Cell>${variant.price}</IndexTable.Cell>

        <IndexTable.Cell>
          <Badge status={variant.inventoryQuantity > 0 ? "success" : "warning"}>
            {variant.inventoryQuantity}
          </Badge>
        </IndexTable.Cell>
      </IndexTable.Row>
    )),
  );

  return (
    <div style={{marginBottom:"80px"}}>
      <Text variant="headingXl" as="h4">
        Variant List
      </Text>
      <LegacyCard>
        <IndexTable
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={list.reduce(
            (count, item) => count + item.variants.length,
            0,
          )}
          headings={[
            { title: "Image" },
            { title: "Name" },
            { title: "Code" },
            { title: "Price" },
            { title: "Inventory Quantity" },
          ]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </div>
  );
};

export default SyncList;
