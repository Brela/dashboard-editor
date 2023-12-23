import React, { useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  InventoryProvider,
  InventoryContext,
} from './contexts/inventory.context';
import { AuthProvider } from "./contexts/auth.context";
import AppRouterContent from "./AppRouterContent";


const App = () => {

  return (
    <>
      <Router>
    
            <AuthProvider>
              <InventoryProvider>
                  <AppRouterContent />
              </InventoryProvider>
            </AuthProvider>
  
      </Router>
    </>
  );
};

export default App;
