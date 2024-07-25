import fetch from 'node-fetch';

/**
 * Create a new issue in Jira
 * @param {*} summary The summary of the issue
 * @param {*} description The description of the issue
 * @param {*} projectKey The project
 * @param {*} parentKey The parent issue
 * @param {*} issueTypeId The issue type
 * @param {*} username Username
 * @param {*} apiToken API Token
 * issueTypeId = "10011" -> Task
 */
const createIssue = async (summary, description, projectKey, parentKey, issueTypeId = "10011", username, apiToken) => {
  const jsonData = {
    "fields": {
      "description": {
        "content": [
          {
            "content": [
              {
                "text": description,
                "type": "text"
              }
            ],
            "type": "paragraph"
          }
        ],
        "type": "doc",
        "version": 1
      },
      "issuetype": {
        "id": issueTypeId
      },
      "parent": {
        "key": parentKey
      },
      "project": {
        "key": projectKey
      },
      "summary": summary,
    }
  };

  const bodyData = JSON.stringify(jsonData);

  try {
    const response = await fetch(`${process.env.JIRA_URL}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${username}:${apiToken}`
        ).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: bodyData
    });

    console.log(`Response: ${response.status} ${response.statusText}`);
    const responseBody = await response.text();
    console.log(responseBody);
  } catch (err) {
    console.error(err);
  }
};

/**
 * Search for issues in Jira based on the project key and summary
 * @param {*} projectKey The project key
 * @param {*} summary The summary of the issue
 * @param {*} username Username
 * @param {*} apiToken API Token
 * @returns List of issues
 */
const searchIssues = async (projectKey, summary, username, apiToken) => {
    const jql = `project=${projectKey} AND summary~"${summary}"`;
    const url = `${process.env.JIRA_URL}/rest/api/3/search?jql=${encodeURIComponent(jql)}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${username}:${apiToken}`
          ).toString('base64')}`,
          'Accept': 'application/json'
        }
      });
  
      console.log(`Response: ${response.status} ${response.statusText}`);
      const responseBody = await response.json();
      return responseBody.issues;
    } catch (err) {
      console.error(err);
      return [];
    }
  };


/**
 * Delete an issue in Jira
 * @param {*} issueId The issue ID
 * @param {*} username Username
 * @param {*} apiToken API Token
 */
const deleteIssue = async (issueId, username, apiToken) => {
    const url = `${process.env.JIRA_URL}/rest/api/3/issue/${issueId}`;
  
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${username}:${apiToken}`
          ).toString('base64')}`,
          'Accept': 'application/json'
        }
      });
  
      console.log(`Deleted Issue: ${issueId}, Response: ${response.status} ${response.statusText}`);
    } catch (err) {
      console.error(`Failed to delete issue: ${issueId}`, err);
    }
  };

export { createIssue, searchIssues, deleteIssue };
