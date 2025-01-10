import { createContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalData, setModalData] = useState({
    open: false,
    title: null,
    message: null,
    note: null,
    cancelAction: null,
    confirmAction: null,
    function: null,
  });

  return (
    <ModalContext.Provider
      value={{
        modalData,
        setModalData,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
