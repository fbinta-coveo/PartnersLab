import { KEY_NAME_PROFILE_SELECTED } from "./ProfileConfig";

const Profile_Selected_Name =
  localStorage.getItem(KEY_NAME_PROFILE_SELECTED) !== null
    ? localStorage
        .getItem(KEY_NAME_PROFILE_SELECTED)
        .replace(/['"]+/g, "")
        .split(" ")[0]
        .toString()
    : "";



export const CaseFormMainTitle = `Hi ${Profile_Selected_Name}, What do you need help with?`;

export const DocumentSuggestTitle = `Here are some Suggested Results`;

export const SubjectTitle = "Write a descriptive title";

export const DescriptionTitle = "Explain the issue";

export const ProvideDetailsDescription = 
`Since when has this issue been affecting you?
Have you encountered this issue before?
What is it preventing you to achieve?`;

export const CaseClassifyFields = [
  { field: "sourcetype", title: "Source type" },
  { field: "sourcetype", title: "Source type" },
];
