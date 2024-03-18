import React from "react";

import { RenderBodyArgs } from "gatsby";

import { themeAtomKey } from "@/hooks";

const onRenderBody = ({
  setHtmlAttributes,
  setPreBodyComponents,
}: RenderBodyArgs) => {
  setPreBodyComponents([
    React.createElement("script", {
      key: "theme",
      dangerouslySetInnerHTML: {
        __html: `
          void function() {
            var cachedMode;

            try {
              var preferredTheme = JSON.parse(localStorage.getItem('${themeAtomKey}'));

              if (preferredTheme && preferredTheme.mode) {
                cachedMode = preferredTheme.mode;
              }
            } catch (err) { }

            function setTheme(newTheme) {
              document.documentElement.className = newTheme;
            }

            var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

            setTheme(cachedMode || (darkQuery.matches ? 'dark' : 'light'));
          }()
        `,
      },
    }),
    React.createElement("script", {
      key: "netlify-identity",
      src: "https://identity.netlify.com/v1/netlify-identity-widget.js",
    }),
    React.createElement("script", {
      key: "netlify-identity-redirect",
      dangerouslySetInnerHTML: {
        __html: `
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on("init", (user) => {
                if (!user) {
                  window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                  });
                }
              });
            }`,
      },
    }),
  ]);

  setHtmlAttributes({ lang: "en" });
};

export { onRenderBody };
