import path from "path";

const templates = Object.freeze({
  indexTemplate: path.resolve(
    "./src/templates/IndexTemplate/IndexTemplate.tsx",
  ),
  notFoundTemplate: path.resolve(
    "./src/templates/NotFoundTemplate/NotFoundTemplate.tsx",
  ),
  categoryTemplate: path.resolve(
    "./src/templates/CategoryTemplate/CategoryTemplate.tsx",
  ),
  categoriesTemplate: path.resolve(
    "./src/templates/CategoriesTemplate/CategoriesTemplate.tsx",
  ),
  tagTemplate: path.resolve("./src/templates/TagTemplate/TagTemplate.tsx"),
  tagsTemplate: path.resolve("./src/templates/TagsTemplate/TagsTemplate.tsx"),
  pageTemplate: path.resolve("./src/templates/PageTemplate/PageTemplate.tsx"),
  postTemplate: path.resolve("./src/templates/PostTemplate/PostTemplate.tsx"),
  snippetsTemplate: path.resolve(
    "./src/templates/SnippetsTemplate/SnippetsTemplate.tsx",
  ),
  bytesTemplate: path.resolve(
    "./src/templates/BytesTemplate/BytesTemplate.tsx",
  ),
});

export default templates;
