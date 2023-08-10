import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  FormControl,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";

import { useState, useEffect } from "react";

import TextInput from "./TextInput";

export default function NodeForm({
  node,
  openFormModal,
  setOpenFormModal,
  treeData,
  setTreeData,
  setSearchResults,
  flattenTree,
}) {
  const [parent, setParent] = useState();
  const [name, setName] = useState();
  const [link, setLink] = useState();
  const [description, setDescription] = useState();

  const [parentIsValid, setParentIsValid] = useState();
  const [nameIsValid, setNameIsValid] = useState();
  const [linkIsValid, setLinkIsValid] = useState();
  const [descriptionIsValid, setDescriptionIsValid] = useState();

  async function submit() {
    if (!parentIsValid || !nameIsValid || !linkIsValid || !descriptionIsValid) {
      console.error("Invalid node details.");
      return;
    }

    // Prepend "http://" to the link if it does not contain
    function sanitizeLink(link) {
      if (link && !/^https?:\/\//i.test(link)) {
        return `http://${link}`;
      }
      return link;
    }

    const newNode = {
      name: name.trim(),
      link: link && link.trim() !== "" ? sanitizeLink(link).trim() : null,
      description:
        description && description.trim() !== "" ? description.trim() : null,
      children: [],
    };

    // Recursive function to find and add child node
    const findAndAddChild = (nodes) => {
      return nodes.map((node) => {
        if (node.name === parent.name) {
          return {
            ...node,
            children: [...node.children, newNode],
          };
        } else if (node.children.length > 0) {
          return {
            ...node,
            children: findAndAddChild(node.children),
          };
        }
        return node;
      });
    };

    let updatedTreeData;

    // If no parent is selected, create a new root node
    if (parent.name === "Unknown") {
      updatedTreeData = [...treeData, newNode];
    } else {
      // Add child node to the appropriate parent
      updatedTreeData = findAndAddChild(treeData);
    }

    // Update the tree data state
    setTreeData(updatedTreeData);
    setSearchResults(flattenTree(updatedTreeData));

    setOpenFormModal(false);
  }

  // Validate if the name is unique in the tree
  function isNameUnique(newNodeName, nodes) {
    for (const node of nodes) {
      if (node.name === newNodeName) {
        return false;
      }
      if (
        node.children.length > 0 &&
        !isNameUnique(newNodeName, node.children)
      ) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    setParent(node?.parent || { name: "Unknown" });
    setName(node?.name);
    setLink(node?.link);
    setDescription(node?.description);

    setParentIsValid(true);
    setNameIsValid(node ? true : false);
    setLinkIsValid(true);
    setDescriptionIsValid(true);
  }, [openFormModal]);

  return (
    <>
      <Backdrop open={openFormModal}>
        <Modal
          open={openFormModal}
          closeAfterTransition
          // submit on Enter key
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submit();
            }
          }}
          // close on Escape key
          onClose={() => {
            setOpenFormModal(false);
          }}
        >
          <Fade in={openFormModal}>
            <FormControl
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",

                maxWidth: "95%",
                width: "40rem",

                maxHeight: "95%",

                borderRadius: "1.5rem",
                padding: "1rem",

                backgroundColor: "whitesmoke",
                boxShadow: "#666 2px 2px 8px",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ textTransform: "uppercase", fontWeight: "bold" }}
              >
                {!node ? "Add node" : "Update node"}
              </Typography>

              <Box
                sx={{
                  overflowY: "auto",
                }}
              >
                <Autocomplete
                  options={[{ name: "Unknown" }, ...flattenTree(treeData)]}
                  clearOnEscape
                  openOnFocus
                  value={parent}
                  getOptionLabel={(option) => option.name} // Display node names
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  } // Compare by node name
                  filterOptions={(options, { inputValue }) =>
                    options.filter((option) =>
                      option.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    )
                  }
                  onChange={(e, selectedValue) => {
                    setParent(selectedValue);
                    setParentIsValid(true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Parent node"
                      required
                      fullWidth
                      margin="dense"
                    />
                  )}
                />

                <TextInput
                  labelText={"Name"}
                  isRequired
                  placeholderText={"Jane Doe"}
                  helperText={{
                    error:
                      "Name must be unique and between 2 and 50 characters",
                    details: "",
                  }}
                  inputProps={{ minLength: 2, maxLength: 50 }}
                  validationFunction={(input) => {
                    return (
                      input.length >= 2 &&
                      input.length <= 50 &&
                      isNameUnique(input, treeData)
                    );
                  }}
                  value={name}
                  setValue={setName}
                  valueIsValid={nameIsValid}
                  setValueIsValid={setNameIsValid}
                ></TextInput>

                <TextInput
                  labelText={"Link"}
                  helperText={{
                    error: "Invalid link",
                    details: "",
                  }}
                  placeholderText={"best.hr"}
                  inputProps={{ maxLength: 50 }}
                  validationFunction={(input) => {
                    const urlPattern = new RegExp(
                      "^(https?:\\/\\/)?" + // validate protocol
                        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
                        "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
                        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
                        "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
                        "(\\#[-a-z\\d_]*)?$",
                      "i"
                    ); // validate fragment locator

                    return (
                      input === "" ||
                      (input.length <= 50 && urlPattern.test(input))
                    );
                  }}
                  value={link}
                  setValue={setLink}
                  valueIsValid={linkIsValid}
                  setValueIsValid={setLinkIsValid}
                ></TextInput>

                <TextInput
                  labelText={"Description"}
                  textFieldProps={{
                    multiline: true,
                    minRows: 2,
                    maxRows: 10,
                  }}
                  helperText={{
                    error: "Description must be under 1000 characters",
                    details: "",
                  }}
                  inputProps={{ maxLength: 1000 }}
                  validationFunction={(input) => {
                    return input.length <= 1000;
                  }}
                  value={description}
                  setValue={setDescription}
                  valueIsValid={descriptionIsValid}
                  setValueIsValid={setDescriptionIsValid}
                ></TextInput>
              </Box>

              <Box
                sx={{
                  marginBlock: "3%",

                  display: "flex",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setOpenFormModal(false);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={submit}
                  disabled={
                    !(
                      parentIsValid &&
                      nameIsValid &&
                      linkIsValid &&
                      descriptionIsValid
                    )
                  }
                >
                  {/* span needed because of bug */}
                  <span>{!node ? "Add node" : "Update node"}</span>
                </Button>
              </Box>
            </FormControl>
          </Fade>
        </Modal>
      </Backdrop>
    </>
  );
}
