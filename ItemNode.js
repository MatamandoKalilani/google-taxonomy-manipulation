const convertItemNode = (line) => {
  var output = {};

  var foundDash = true;
  var pointer = 0;
  var id = "";

  while (foundDash) {
    if (line[pointer] === "-") {
      foundDash = false;
      break;
    }
    id += line[pointer];
    pointer++;
  }
  output.id = parseInt(id.trim());

  const lineWithoutId = line.substring(++pointer, line.length);

  var arrayOfCategories = lineWithoutId.split(/\s*>\s*/);

  arrayOfCategories = arrayOfCategories.map((category) => category.trim());

  arrayOfCategories = arrayOfCategories.reverse();

  output.categories = arrayOfCategories;

  return output;
};

module.exports = { convertItemNode };
