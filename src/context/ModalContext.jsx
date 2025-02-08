import { createContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalData, setModalData] = useState({
    open: false,

    title: null,
    message: null,
    note: null,

    cancelActionText: null,
    confirmActionText: null,

    // if condition is false, the modal will be displayed
    // otherwise it will just call function
    modalCondition: false,

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
