import { createContext, useState } from "react";

const DeleteModalContext = createContext();

export function DeleteModalProvider({ children }) {
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    modalActionTitle: null,
    modalText: null,
    function: null,
  });

  return (
    <DeleteModalContext.Provider
      value={{
        deleteModal,
        setDeleteModal,
      }}
    >
      {children}
    </DeleteModalContext.Provider>
  );
}

export default DeleteModalContext;
