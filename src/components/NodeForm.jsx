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
  searchResults,
  updateData,
}) {
  const [parent, setParent] = useState();
  const [name, setName] = useState();
  const [link, setLink] = useState();
  const [description, setDescription] = useState();

  const [parentIsValid, setParentIsValid] = useState();
  const [nameIsValid, setNameIsValid] = useState();
  const [linkIsValid, setLinkIsValid] = useState();
  const [descriptionIsValid, setDescriptionIsValid] = useState();

  function submit() {
    if (!parentIsValid || !nameIsValid || !linkIsValid || !descriptionIsValid) {
      console.error("Invalid node details.");
      return;
    }

    const updatedNode = {
      name: name.trim(),
      link: link && link.trim() !== "" ? sanitizeLink(link).trim() : null,
      description:
        description && description.trim() !== "" ? description.trim() : null,
      children: node ? findSubtree(treeData, node.name).children : [],
    };

    let updatedTreeData = [...treeData];

    if (node?.parent === parent.name) {
      // Editing an existing node with same parent
      updatedTreeData = replaceSubtree(updatedTreeData, node.name, updatedNode);
    } else {
      if (node) {
        if (node.parent !== "Unknown") {
          // Remove node from old parent's children
          const oldParentSubtree = findSubtree(updatedTreeData, node.parent);
          oldParentSubtree.children = oldParentSubtree.children.filter(
            (child) => child.name !== node.name
          );
          updatedTreeData = replaceSubtree(
            updatedTreeData,
            oldParentSubtree.name,
            oldParentSubtree
          );
        } else {
          // Remove node from top level of the tree
          updatedTreeData = updatedTreeData.filter(
            (topLevelNode) => topLevelNode.name !== node.name
          );
        }
      }

      if (parent.name === "Unknown") {
        // Adding or updating a root node
        updatedTreeData.push(updatedNode);
      } else {
        // Adding or updating a child node
        const newParentSubtree = findSubtree(updatedTreeData, parent.name);
        newParentSubtree.children.push(updatedNode);
        updatedTreeData = replaceSubtree(
          updatedTreeData,
          newParentSubtree.name,
          newParentSubtree
        );
      }
    }

    updateData(updatedTreeData);
    setOpenFormModal(false);
  }

  function replaceSubtree(tree, targetName, updatedSubtree) {
    return tree.map((node) => {
      if (node.name === targetName) {
        return updatedSubtree;
      } else if (node.children && node.children.length > 0) {
        const updatedChildren = replaceSubtree(
          node.children,
          targetName,
          updatedSubtree
        );
        return {
          ...node,
          children: updatedChildren,
        };
      } else {
        return node;
      }
    });
  }

  function findSubtree(nodeTree, targetNodeName) {
    for (const node of nodeTree) {
      if (node.name === targetNodeName) {
        return node;
      }

      if (node.children.length > 0) {
        const subtree = findSubtree(node.children, targetNodeName);
        if (subtree) {
          return subtree;
        }
      }
    }

    return null;
  }

  // Add http protocol to link if no protocol in link
  function sanitizeLink(link) {
    if (link && !/^https?:\/\//i.test(link)) {
      return `http://${link}`;
    }
    return link;
  }

  // Returns array of subnode names (including itself)
  function getSubnodes(node, subNodesList = []) {
    subNodesList.push(node.name);

    if (node.children.length > 0) {
      node.children.forEach((child) => getSubnodes(child, subNodesList));
    }

    return subNodesList;
  }

  // Validate if the node name is unique in list
  function isNameUnique(newNodeName, nodesList) {
    for (const node of nodesList) {
      if (node.name === newNodeName) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    setParent({ name: node?.parent || "Unknown" });
    setName(node?.name);
    setLink(node?.link);
    setDescription(node?.description);

    setParentIsValid(true);
    setNameIsValid(node ? true : false);
    setLinkIsValid(true);
    setDescriptionIsValid(true);
  }, [openFormModal]);

  return (
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
                options={[{ name: "Unknown" }, ...searchResults]}
                clearOnEscape
                openOnFocus
                disabled={treeData.length === 0}
                value={parent}
                getOptionLabel={(option) => option.name} // Display node names
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                } // Compare by node name
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) => {
                    const doesntContainSubnodes =
                      !node ||
                      !getSubnodes(findSubtree(treeData, node.name)).some(
                        (subnode) =>
                          subnode.toLowerCase() === option.name.toLowerCase()
                      );

                    const includesSearchTerm = option.name
                      .toLowerCase()
                      .includes(inputValue.toLowerCase());

                    return doesntContainSubnodes && includesSearchTerm;
                  })
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
                    helperText={node ? "Cannot be itself or its subnode" : ""}
                  />
                )}
              />

              <TextInput
                labelText={"Name"}
                isRequired
                placeholderText={"Jane Doe"}
                helperText={{
                  error: "Name must be unique and between 2 and 50 characters",
                  details: "",
                }}
                inputProps={{ minLength: 2, maxLength: 50 }}
                validationFunction={(input) => {
                  return (
                    input.length >= 2 &&
                    input.length <= 50 &&
                    isNameUnique(input, searchResults)
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
  );
}
