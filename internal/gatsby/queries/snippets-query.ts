import { CreatePagesArgs } from "gatsby";

import * as types from "../types";

export interface SnippetQueryResult {
  allMarkdownRemark: {
    edges?: Array<types.Edge>;
  };
}

const snippetsQuery = async (graphql: CreatePagesArgs["graphql"]) => {
  const result = await graphql<SnippetQueryResult>(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: { draft: { ne: true }, template: { eq: "snippet" } }
        }
      ) {
        edges {
          node {
            frontmatter {
              template
              slug
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  return result?.data?.allMarkdownRemark;
};

export default snippetsQuery;
