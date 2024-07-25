## Jira Issue Creator

This is a Node.js project that allows you to create Jira issues from a CSV file.

### Installation

1. Clone the repository: `git clone https://github.com/hakanseysane/jira-issue-creator.git`
2. Install the dependencies: `npm install`
3. Set your environment variables via copy .env.example to your real .env file

### Usage

1. Prepare your CSV file with the necessary information for creating Jira issues.
2. Run the following command: `npm run start`
3. The script will read the `issues.csv` CSV file and create Jira issues based on the provided data.

### Configuration

Before running the script, make sure to configure the following environment variables:

- `JIRA_BASE_URL`: The base URL of your Jira instance.
- `JIRA_USERNAME`: Your Jira username.
- `JIRA_API_TOKEN`: Your Jira API token.

### Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to open an issue or submit a pull request.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
