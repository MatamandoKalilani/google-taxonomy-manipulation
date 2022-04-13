const fs = require("fs");
const readline = require("readline");
const { convertItemNode } = require("./ItemNode");

var makeTaxonomy = false;
var saveWithIds = true;
var fullObjectTree = {};
var positionPointer = 1;

const addNodeToObjectTree = (node, objectTree) => {
  if (objectTree[node.categories[node.categories.length - positionPointer]]) {
    addNodeToObjectTree(
      node,
      objectTree[node.categories[node.categories.length - positionPointer++]]
        .subCategories
    );
  } else {
    objectTree[node.categories[0]] = {
      id: node.id,
      name: node.categories[0],
      subCategories: {},
    };
    positionPointer = 1;
  }
};

function isEmpty(object) {
  for (const property in object) {
    return false;
  }
  return true;
}

const saveWithIDs = (taxonomyWithNames) => {
  for (const key in taxonomyWithNames) {
    let holdKey = "" + taxonomyWithNames[key].id.toString() + "";
    taxonomyWithNames[holdKey] = taxonomyWithNames[key];
    delete taxonomyWithNames[key];
    if (!isEmpty(taxonomyWithNames[holdKey].subCategories)) {
      saveWithIDs(taxonomyWithNames[holdKey].subCategories);
    }
  }
  return taxonomyWithNames;
};

const saveFile = (nameValue, anObject) => {
  const data = JSON.stringify(anObject);

  // write JSON string to a file
  fs.writeFile(nameValue, data, (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
};

const convertTxtToJson = async () => {
  if (makeTaxonomy) {
    const fileStream = fs.createReadStream("input.txt");

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      // Each line in input.txt will be successively available here as `line`.
      console.log(`Line from file: ${line}`);
      // Convert File into Our Special Object
      var itemNode = convertItemNode(line);

      await addNodeToObjectTree(itemNode, fullObjectTree);
    }
    console.log(fullObjectTree);

    await saveFile("taxonomy.json", fullObjectTree);
  }

  // Saving With Ids

  if (saveWithIds) {
    fs.readFile("./taxonomy.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      // Execute Code
      var taxonomyAsJSON = jsonString;

      var taxonomyObject = JSON.parse(taxonomyAsJSON);

      var taxonomyWithIds = saveWithIDs(taxonomyObject);

      saveFile("taxonomy-with-ids.json", taxonomyWithIds);
      // Recursive function to replace names with Id
    });
  }
};

convertTxtToJson();
