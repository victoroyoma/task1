const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the provided PORT environment variable or default to 3000

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/api', (req, res) => {
  try {
    const slackName = 'Ogheneyoma Victor'; // Modify with your Slack name
    const track = 'Backend'; // Modify with your track

    // Get the current day and time in UTC
    const currentUtcTime = new Date().toISOString();

    // Validate the time within a +/-2 minute window
    const validatedUtcTime = validateUtcTime(currentUtcTime);

    // Get the GitHub URL of the file being run
    const githubFileUrl = 'https://github.com/username/repo/blob/main/file_name.ext';

    // Get the GitHub URL of the full source code repository
    const githubRepoUrl = 'https://github.com/username/repo';

    const response = {
      slack_name: slackName,
      current_day: getCurrentDay(),
      utc_time: validatedUtcTime,
      track: track,
      github_file_url: githubFileUrl,
      github_repo_url: githubRepoUrl,
      status_code: 200,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function validateUtcTime(utcTime) {
  const currentUtcTime = new Date(utcTime);
  const permissibleWindow = 2 * 60 * 1000; // 2 minutes in milliseconds
  const now = new Date();

  const timeDifference = Math.abs(currentUtcTime - now);

  if (timeDifference <= permissibleWindow) {
    return currentUtcTime.toISOString();
  } else {
    // Adjust the time within the permissible window
    if (currentUtcTime > now) {
      // UTC time is ahead of the current time
      const adjustedTime = new Date(now.getTime() + permissibleWindow);
      return adjustedTime.toISOString();
    } else {
      // UTC time is behind the current time
      const adjustedTime = new Date(now.getTime() - permissibleWindow);
      return adjustedTime.toISOString();
    }
  }
}

function getCurrentDay() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayIndex = new Date().getUTCDay();
  return days[currentDayIndex];
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
