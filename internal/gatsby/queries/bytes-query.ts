import { CreatePagesArgs } from "gatsby";

import * as types from "../types";

export interface ByteQueryResult {
  allMarkdownRemark: {
    edges?: Array<types.Edge>;
  };
}

const bytesQuery = async (graphql: CreatePagesArgs["graphql"]) => {
  const result = await graphql<ByteQueryResult>(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: { draft: { ne: true }, template: { eq: "byte" } }
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

export default bytesQuery;
