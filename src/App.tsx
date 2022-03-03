import React from "react";
import axios from "axios";
import {
  Alert,
  Button,
  CrossIcon,
  FormField,
  Heading,
  Pane,
  TextareaField,
  TextInputField,
  UnarchiveIcon,
} from "evergreen-ui";
import { useMutation, useQuery } from "react-query";
import "./App.css";
import { SelectLocationMenu } from "./SelectLocationMenu";
import { DOMMessage, DOMMessageResponse } from "../types/DOMMessages";
import { appendDataBefore } from "./utilities";

interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url?: any;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

interface GitHubCommit {
  sha: any;
  content: string;
  message: string;
  committer: {
    name: string;
    email: string;
  };
}


const config = {
  GITHUB_BASE_URL: process.env.GITHUB_BASE_URL || "https://api.github.com",
  GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER || "ommyjay",
  GITHUB_REPO_OWNER_EMAIL: process.env.GITHUB_REPO_OWNER_EMAIL || "ommyjay@gmail.com",
  GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME || 'stuff',
  GITHUB_REPO_DEFAULT_FILE: process.env.GITHUB_REPO_DEFAULT_FILE || "README.md", //case sensitive
  GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN
}

const retrieveRepositoryContents = async () => {
  const repoUrl = `${config.GITHUB_BASE_URL}/repos/${config.GITHUB_REPO_OWNER}/${config.GITHUB_REPO_NAME}/contents`;
  try {
    const { data } = await axios.get(repoUrl)
    return Promise.resolve(data);
  } catch (error) {
    console.log('error retrieveRepositoryContents:>> ', error);
  }
}

const retrieveREADMEContents = async (readmeFilePath: string) => {
  const repoUrl = `${config.GITHUB_BASE_URL}/repos/${config.GITHUB_REPO_OWNER}/${config.GITHUB_REPO_NAME}/contents/${readmeFilePath}`;
  try {
    const { data } = await axios.get(repoUrl)
    return Promise.resolve(data);
  } catch (error) {
    console.log('error retrieveREADMEContents:>> ', error);
  }
}


const postUpdatedContents = async (readmeFilePath: string, gitHubCommit: GitHubCommit) => {
  const repoUrl = `${config.GITHUB_BASE_URL}/repos/${config.GITHUB_REPO_OWNER}/${config.GITHUB_REPO_NAME}/contents/${readmeFilePath}`;
  try {
    const { data } = await axios.put(repoUrl, gitHubCommit, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${config.GITHUB_ACCESS_TOKEN}`,
      },
    })
    return Promise.resolve(data);
  } catch (error) {
    console.log('error retrieveREADMEContents:>> ', error);
  }
}

function App() {
  const [domContentResponse, setDomContentResponse] = React.useState<DOMMessageResponse>({
    title: '',
    description: '',
    headlines: [],
    url: '',
    websiteName: '',
    favicon: '' as any
  });

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired only when title is missing.
       */
      if (!domContentResponse.title) {
        chrome.tabs.sendMessage(
          tabs[0].id || 0,
          { type: 'GET_DOM' } as DOMMessage,
          (response: DOMMessageResponse) => {
            setDomContentResponse(response)
          });
      }

    });
  });

  const { data: repo } = useQuery('repo', retrieveRepositoryContents)
  const [selectedItems, setSelectedItems] = React.useState<
    (string | number)[]
  >([]);
  const [archivingStatus, setArchivingStatus] = React.useState<boolean>(false);
  const mutation = useMutation(postUpdatedContents as any)

  console.log('mutation :>> ', mutation.data);
  console.log('domContentResponse :>> ', domContentResponse);

  const handleSubmission = async () => {
    setArchivingStatus(true);
    if (selectedItems.length === 0) {
      const { content, sha } = await retrieveREADMEContents(config.GITHUB_REPO_DEFAULT_FILE)
      const decodedContent = decodeURIComponent(
        escape(window.atob(content))
      );
      const dataToAppend = `![${domContentResponse.title}](${domContentResponse.favicon}) [${domContentResponse.title}](${domContentResponse.url}) \n> ${domContentResponse.description} \n`;
      console.log('dataToAppend :>> ', dataToAppend);
      // append data in the front
      const appendedContent = appendDataBefore(dataToAppend, decodedContent);
      const encodedAppendedContent = window.btoa(
        unescape(encodeURIComponent(appendedContent))
      );
      const gitHubCommit = {
        sha,
        content: encodedAppendedContent,
        message: `✨ NEW: Archived page from ${domContentResponse.websiteName}`,
        committer: {
          name: config.GITHUB_REPO_OWNER,
          email: config.GITHUB_REPO_OWNER_EMAIL,
        },
      }
      postUpdatedContents(config.GITHUB_REPO_DEFAULT_FILE, gitHubCommit)
    }

  }

  return (
    <div className="app">
      <Heading padding={16} borderBottom={"1px dashed rgb(223, 226, 229)"}>
        GitHub Archiver
      </Heading>
      <Pane padding={16} background="tint1" flex="1">
        <TextInputField
          spellCheck
          label="Title"
          //hint="Label for the archived link"
          value={domContentResponse.title}
          onChange={(item: React.ChangeEvent<HTMLInputElement>) =>
            setDomContentResponse({ ...domContentResponse, title: item.target.value })
          }
        />
        <TextareaField
          marginTop={"-16px"}
          spellCheck
          grammarly
          label="Comment"
          //hint="GitHub commit message"
          value={domContentResponse.description}
          onChange={(item: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDomContentResponse({ ...domContentResponse, description: item.target.value })
          }
        />
        {repo && <FormField
          marginTop={"-16px"}
          paddingBottom={16}
          hint="Github Repo Directory"
          label="Save In"
          flex="1"
          width="100%"
        >
          <SelectLocationMenu
            repositoryLocations={repo.filter((location: GitHubContent) => location.type === "dir").map((location: GitHubContent) => location.name)}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems} />
        </FormField>}
        <Button
          marginY={8}
          marginRight={12}
          //iconBefore={UnarchiveIcon}
          appearance="primary"
          onClick={() => handleSubmission()}
          isLoading={archivingStatus}
        >
          Archive
        </Button>
        <Button marginY={8} marginRight={12} /* iconBefore={CrossIcon} */>
          Cancel
        </Button>
      </Pane>
      {/*       <Pane paddingY={32} paddingX={16}>
        <Alert
          intent="success"
          title=" Page Archived"
        >
          Click Outside The Popup To Close (Auto close after 5 secs)
        </Alert>
      </Pane>
 */}
    </div>
  );
}


export default App;
