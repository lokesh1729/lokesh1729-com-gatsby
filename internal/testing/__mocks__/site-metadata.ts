import author from "./author";
import menu from "./menu";

export default {
  site: {
    siteMetadata: {
      url: "https://www.lumen.local",
      title: "Blog by Lokesh Sanapalli",
      subtitle:
        "Lokesh Sanapalli is a software engineer who loves to solve real world problems using software engineering principles.",
      copyright: "All rights reserved.",
      postsPerPage: 4,
      author,
      menu,
    },
  },
};
