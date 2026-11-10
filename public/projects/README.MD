# HOW TO MAKE A PAGE

The pages are formed out of folders containing a `breakdown.md` file which contains all the content and a `summary.md` file which contains a brief summary. This file contains the content of the page, and is written in markdown. A `meta.json` file is also required for each page, containing it's name, description, tags, languages and the status of the project. There is also an option to provide a `logo.png` file, which will be displayed on project list pages.

If the breakdown you can replace the breakdown.md file with a folder called `breakdown` which contains multiple markdown files. The files will be displayed in alphabetical order, so you can use numbers to order them. For example, if you have a project with three breakdown files, you could name them `1.md`, `2.md` and `3.md`. The content of the files will be displayed in the order they are named.

The folder the files are stored in must have the same name as the project but in lowercase and with spaces replaced by hyphens. For example, a project called "My Project" would be stored in a folder called `my-project`.

```json
{
   "name": "Example Project",
   // The accent colour associated with the project
   "colour": "#ffffff",
   "description": "This is an example project.",
   "tags": ["example", "project"],
   "languages": ["Python", "JavaScript"],
   // The status of the project (in-progress, complete, archived)
   "status": "in-progress",
   "startDate": "10/01/2026",
   // Can be null if the project is ongoing
   "endDate": "10/01/2027"
}
```
