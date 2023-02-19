import React from "react";

import { render as reactTestingLibraryRender } from "@testing-library/react";
import { StaticQuery, useStaticQuery } from "gatsby";

import * as mocks from "@/mocks";
import { testUtils } from "@/utils";

import CategoryTemplate, { Head as GatsbyHead } from "./CategoryTemplate";

const mockedStaticQuery = StaticQuery as jest.Mock;
const mockedUseStaticQuery = useStaticQuery as jest.Mock;

describe("CategoryTemplate", () => {
  const props = {
    data: {
      allMarkdownRemark: mocks.allMarkdownRemark,
    },
    pageContext: mocks.pageContext,
  };

  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const tree = testUtils
      .createSnapshotsRenderer(<CategoryTemplate {...props} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("head renders correctly", () => {
    reactTestingLibraryRender(<GatsbyHead {...props} />);

    expect(testUtils.getMeta("twitter:card")).toEqual("summary_large_image");
    expect(testUtils.getMeta("og:title")).toEqual(
      "Typography - Page 2 - Blog by Lokesh Sanapalli",
    );
    expect(testUtils.getMeta("twitter:title")).toEqual(
      "Typography - Page 2 - Blog by Lokesh Sanapalli",
    );
    expect(testUtils.getMeta("twitter:description")).toEqual(
      "Lokesh Sanapalli is a software engineer who loves to solve real world problems using software engineering principles.",
    );
    expect(testUtils.getMeta("description")).toEqual(
      "Lokesh Sanapalli is a software engineer who loves to solve real world problems using software engineering principles.",
    );
    expect(testUtils.getMeta("og:description")).toEqual(
      "Lokesh Sanapalli is a software engineer who loves to solve real world problems using software engineering principles.",
    );
  });
});
