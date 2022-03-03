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
import { useQuery } from "react-query";
import "./App.css";
import { SelectLocationMenu } from "./SelectLocationMenu";
import { DOMMessage, DOMMessageResponse } from "../types/DOMMessages";

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


const config = {
  GITHUB_BASE_URL: process.env.GITHUB_BASE_URL || "https://api.github.com",
  GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER || "ommyjay",
  GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME || 'stuff',
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

function App() {
  const { data } = useQuery('repo', retrieveRepositoryContents)
  const [domContentResponse, setDomContentResponse] = React.useState<DOMMessageResponse>({ title: '', description: '', headlines: [], url: '' });

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
  return (
    <div className="app">
      <Heading padding={16} borderBottom={"1px dashed rgb(223, 226, 229)"}>
        GitHub Archiver
      </Heading>
      <Pane padding={16} background="tint1" flex="1">
        <TextInputField
          label="Title"
          hint="Label for the archived link"
          placeholder={domContentResponse.title}
        />
        {data && <FormField
          paddingBottom={16}
          hint="Github repo directory"
          label="Location"
          flex="1"
          width="100%"
        >
          <SelectLocationMenu
            repositoryLocations={data.filter((location: GitHubContent) => location.type === "dir").map((location: GitHubContent) => location.name)} />
        </FormField>}

        <TextareaField
          label="Comment"
          hint="GitHub commit message"
          placeholder={domContentResponse.headlines.join("\n")}
        />
        <FormField paddingBottom="16" flex="1" label="">
          <Button
            marginY={8}
            marginRight={12}
            iconBefore={UnarchiveIcon}
            appearance="primary"
          >
            Archive
          </Button>
          <Button marginY={8} marginRight={12} iconBefore={CrossIcon}>
            Cancel
          </Button>
        </FormField>
      </Pane>
      <Pane paddingY={32} paddingX={16}>
        <Alert
          intent="success"
          title=" Page Archived"
        >
          Click Outside The Popup To Close (Auto close after 5 secs)
        </Alert>
      </Pane>

    </div>
  );
}


export default App;
