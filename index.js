import { createIssue, searchIssues, deleteIssue} from './jira.js';
import csv from 'csv-parser';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Sleep function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Jira credentials
const username = process.env.JIRA_USERNAME;
const apiToken = process.env.JIRA_API_TOKEN;

/* Process the issues in the CSV file 
* The processIssues function reads the CSV file and processes each row.
* For each row, it searches for the issue in Jira using the searchIssues function.
* If the issue is found, it deletes all but the first issue.
* If the issue is not found, it creates a new issue using the createIssue function.
* Sleep is used to avoid rate limiting.
*/
const processIssues = async (issues) => {
  for (const row of issues) {
    const summary = row['Summary'];
    const description = row['Description'];
    const projectKey = row['Project Key'];
    const parentKey = row['Parent Key'];
    
    // Sleep
    await sleep(300);

    const issueList = await searchIssues(projectKey, summary, username, apiToken);
    if (issueList.length > 1) {
        for (let i = 1; i < issueList.length; i++) {
          await deleteIssue(issueList[i].id, username, apiToken);
          // Sleep
          await sleep(300);
        }
      } else if (issueList.length === 0) {
        // Call the createIssue function
        await createIssue(summary, description, projectKey, parentKey, "10016", username, apiToken);
        // Sleep
        await sleep(300);
      }
    
  }
};

// Read the CSV file
const issues = [];
fs.createReadStream('issues.csv')
  .pipe(csv())
  .on('data', (row) => {
    issues.push(row);
  })
  .on('end', async () => {
    console.log('CSV file successfully processed');
    await processIssues(issues);
  });
