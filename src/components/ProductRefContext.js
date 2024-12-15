import React, { createContext, useRef } from 'react';

const ProductRefContext = createContext(null);

export const ProductRefProvider = ({ children }) => {
  const productRef = useRef(null);
  return (
    <ProductRefContext.Provider value={productRef}>
      {children}
    </ProductRefContext.Provider>
  );
};

export default ProductRefContext;
