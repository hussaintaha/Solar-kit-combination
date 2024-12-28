import React from "react";
import { Card, LegacyCard, Tabs, Text } from "@shopify/polaris";
import { useState, useCallback } from "react";
import SyncSettings from "./sync-components/SyncSettings";
import SyncList from "./sync-components/SyncList";

const SynchingInventory = () => {
  const [selected, setSelected] = useState(0);

  const handleTabChange = (selectedTabIndex) => {
    setSelected(selectedTabIndex);
  };

  const tabs = [
    {
      id: "all-settings-1",
      content: "Settings",
      panelID: "all-settings-content-1",
    },
    {
      id: "accepts-list-1",
      content: "List",
      panelID: "accepts-list-content-1",
    },
  ];

  const tabsMarkup = () => {
    switch (selected) {
      case 0:
        return <SyncSettings />;
      case 1:
        return <SyncList />;
      default:
        return <div>No content available for this tab.</div>;
    }
  };

  return (
    <div>
      <div className="heading" style={{ marginBottom: "20px" }}>
        <Text variant="headingXl" as="h4">
          Synching Inventory
        </Text>
      </div>

      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <LegacyCard.Section>
            <LegacyCard.Section>{tabsMarkup()}</LegacyCard.Section>
          </LegacyCard.Section>
        </Tabs>
      </Card>
    </div>
  );
};

export default SynchingInventory;
