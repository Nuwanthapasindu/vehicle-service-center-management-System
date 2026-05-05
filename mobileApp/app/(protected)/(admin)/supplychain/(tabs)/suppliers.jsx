import React from 'react';
import enums from '../../../../../constants/enums';
import SupplyChainListScreen from '../../../../../components/supplychain/SupplyChainListScreen';

export default function SuppliersTab() {
  return <SupplyChainListScreen activeTab={enums.SUPPLY_CHAIN_TABS.SUPPLIERS} />;
}
