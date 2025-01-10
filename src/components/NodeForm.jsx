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

import { useState, useEffect, useMemo } from "react";

import CustomTextInput from "./CustomTextInput";
import CustomAutocomplete from "./CustomAutocomplete";

export default function NodeForm({
  node,
  openFormModal,
  setOpenFormModal,
  treeData,
  flattenedTree,
  updateData,
}) {
  const [formData, setFormData] = useState({
    entity: {
      parent: null,
      name: null,
      link: null,
      description: null,
    },
    validation: {
      parentIsValid: true,
      nameIsValid: false,
      linkIsValid: true,
      descriptionIsValid: true,
    },
  });

  // Build a map for quick node lookups
  const nodeMap = useMemo(() => {
    const map = new Map();
    function buildMap(tree) {
      tree.forEach((node) => {
        map.set(node.name, node);
        if (node.children && node.children.length > 0) {
          buildMap(node.children);
        }
      });
    }
    buildMap(treeData);
    return map;
  }, [treeData]);

  function submit() {
    const formIsValid = Object.values(formData.validation).every(Boolean);

    if (!formIsValid) {
      console.error("Invalid node details.");
      return;
    }

    const updatedNode = {
      name: formData.entity.name.trim(),
      link:
        formData.entity.link && formData.entity.link.trim() !== ""
          ? sanitizeLink(formData.entity.link).trim()
          : null,
      description:
        formData.entity.description && formData.entity.description.trim() !== ""
          ? formData.entity.description.trim()
          : null,
      children: node ? nodeMap.get(node.name)?.children || [] : [],
    };

    let updatedTreeData = [...treeData];

    if (node?.parent === formData.entity.parent) {
      // If the parent of the current node has not changed (still the same parent as in the form data):
      // Update the subtree where the current node resides.
      updatedTreeData = replaceSubtree(updatedTreeData, node.name, updatedNode);
    } else {
      // If the parent of the current node has changed:
      if (node) {
        // If the node being updated already exists:
        if (node.parent !== "No parent (root node)") {
          // If the current node is not a root node (has a parent):
          const oldParentSubtree = nodeMap.get(node.parent);
          // Find the old parent subtree using the `nodeMap`.

          oldParentSubtree.children = oldParentSubtree.children.filter(
            (child) => child.name !== node.name
          );
          // Remove the current node from the old parent's children.

          updatedTreeData = replaceSubtree(
            updatedTreeData,
            oldParentSubtree.name,
            oldParentSubtree
          );
          // Update the tree data by replacing the old parent's subtree with the modified one.
        } else {
          // If the current node is a root node (does not have a parent):
          updatedTreeData = updatedTreeData.filter(
            (topLevelNode) => topLevelNode.name !== node.name
          );
          // Remove the current node from the top-level nodes in the tree.
        }
      }

      // Handle adding the node to its new parent:
      if (formData.entity.parent === "No parent (root node)") {
        // If the new parent is the root (node is becoming a top-level node):
        updatedTreeData.push(updatedNode);
        // Add the updated node directly to the top-level of the tree.
      } else {
        // If the new parent is not the root (node is being added under a new parent):
        const newParentSubtree = nodeMap.get(formData.entity.parent);
        // Find the new parent subtree using the `nodeMap`.

        newParentSubtree.children.push(updatedNode);
        // Add the updated node to the new parent's children.

        updatedTreeData = replaceSubtree(
          updatedTreeData,
          newParentSubtree.name,
          newParentSubtree
        );
        // Update the tree data by replacing the new parent's subtree with the modified one.
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

  function sanitizeLink(link) {
    if (link && !/^https?:\/\//i.test(link)) {
      return `http://${link}`;
    }
    return link;
  }

  useEffect(() => {
    setFormData({
      entity: {
        ...node,
        // if in edit mode (node exists) set its parent as parent,
        // else if a node in tree is selected, set it as parent,
        // else set to no parent
        parent: node?.parent ?? "No parent (root node)",
      },
      validation: {
        parentIsValid: true,
        nameIsValid: node ? true : false,
        linkIsValid: true,
        descriptionIsValid: true,
      },
    });
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
              top: { xs: "5%", sm: "50%" },
              left: "50%",
              transform: {
                xs: "translateX(-50%)",
                sm: "translate(-50%, -50%)",
              },

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

            <Box sx={{ overflowY: "auto" }}>
              <CustomAutocomplete
                options={[
                  {
                    name: "No parent (root node)",
                  },
                  ...flattenedTree,
                ]}
                entityKey="parent"
                validationKey="parentIsValid"
                label="Parent Node"
                formatter={(option) => option.name}
                disabledCondition={treeData.length === 0}
                helperTextCondition={!!node}
                helperText="Cannot be itself or its subnode"
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextInput
                labelText="Name"
                isRequired
                placeholderText="Node Name"
                helperText={{
                  error: "Name must be unique and between 2 and 50 characters",
                  details: "",
                }}
                inputProps={{ name: "name", minLength: 2, maxLength: 50 }}
                validationFunction={(input) =>
                  input.length >= 2 && input.length <= 50 && !nodeMap.has(input)
                }
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextInput
                labelText="Link"
                helperText={{
                  error: "Invalid link",
                  details: "",
                }}
                placeholderText="http://example.com"
                inputProps={{ name: "link", maxLength: 50 }}
                validationFunction={(input) => {
                  const urlPattern = new RegExp(
                    "^(https?:\\/\\/)?" +
                      "(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}" +
                      "|((\\d{1,3}\\.){3}\\d{1,3}))" +
                      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
                      "(\\?[;&a-z\\d%_.~+=-]*)?" +
                      "(\\#[-a-z\\d_]*)?$",
                    "i"
                  );
                  return (
                    input === "" ||
                    (input.length <= 50 && urlPattern.test(input))
                  );
                }}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextInput
                labelText="Description"
                textFieldProps={{
                  multiline: true,
                  minRows: 2,
                  maxRows: 10,
                }}
                helperText={{
                  error: "Description must be under 1000 characters",
                  details: "",
                }}
                inputProps={{ name: "description", maxLength: 1000 }}
                validationFunction={(input) => input.length <= 1000}
                formData={formData}
                setFormData={setFormData}
              />
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
                disabled={Object.values(formData.validation).some((v) => !v)}
              >
                <span>{!node ? "Add node" : "Update node"}</span>
              </Button>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
