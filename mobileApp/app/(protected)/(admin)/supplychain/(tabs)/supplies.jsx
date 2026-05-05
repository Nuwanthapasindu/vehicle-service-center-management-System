import React from 'react';
import enums from '../../../../../constants/enums';
import SupplyChainListScreen from '../../../../../components/supplychain/SupplyChainListScreen';

export default function SuppliesTab() {
  return <SupplyChainListScreen activeTab={enums.SUPPLY_CHAIN_TABS.SUPPLIES} />;
}
