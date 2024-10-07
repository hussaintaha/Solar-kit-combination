import SolarPanelTable from "../collections/SolarPanelTable";
import Settings from "./components/Settings";
import React from 'react'



React.useLayoutEffect = React.useEffect


export default function Index() {

  return (
    <>
      <Settings />
      <SolarPanelTable />
    </>
  );
}
