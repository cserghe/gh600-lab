---
applyTo: "tests/**/*.ts"                      # frontmatter: these rules load ONLY when touching files matching this glob
---
Each test has one assertion focus. <!-- keeps context scoped: irrelevant rules stay out of other tasks -->
Name tests "should <behaviour> when <condition>".
