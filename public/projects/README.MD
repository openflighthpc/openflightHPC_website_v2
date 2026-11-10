# HOW TO MAKE A PAGE

The pages are formed out of folders containing a `breakdown.md` file which contains all the content and a `summary.md` file which contains a brief summary. This file contains the content of the page, and is written in markdown. A `meta.json` file is also required for each page, containing it's name, description, tags, languages and the status of the project. There is also an option to provide a `logo.png` file, which will be displayed on project list pages.

The folder the files are stored in must have the same name as the project but in lowercase and with spaces replaced by hyphens. For example, a project called "My Project" would be stored in a folder called `my-project`.

```json
{
   "name": "Example Project",
   "description": "This is an example project.",
   "tags": ["example", "project"],
   "languages": ["Python", "JavaScript"],
   // The status of the project (active, complete, archived, etc.)
   "status": "active",
   "startDate": "10/01/2026",
   // Can be null if the project is ongoing
   "endDate": "10/01/2027"
}
```
