export default async function handler(req, res) {
  // Cache for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  const token = process.env.GITHUB_TOKEN;
  const username = 'Bibin-VR';

  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        repositories(first: 100, ownerAffiliations: OWNER) {
          totalCount
        }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                contributionLevel
                date
              }
            }
          }
        }
        createdAt
        followers {
          totalCount
        }
        starredRepositories {
          totalCount
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ error: data.errors[0].message });
    }

    const user = data.data.user;
    const calendar = user.contributionsCollection.contributionCalendar;

    // Build contribution grid (last 26 weeks)
    const allWeeks = calendar.weeks;
    const last26Weeks = allWeeks.slice(-26);
    const contributionGrid = last26Weeks.map(week =>
      week.contributionDays.map(day => {
        switch (day.contributionLevel) {
          case 'NONE': return 0;
          case 'FIRST_QUARTILE': return 1;
          case 'SECOND_QUARTILE': return 2;
          case 'THIRD_QUARTILE': return 3;
          case 'FOURTH_QUARTILE': return 4;
          default: return 0;
        }
      })
    );

    // Calculate years of experience from account creation
    const createdYear = new Date(user.createdAt).getFullYear();
    const yearsExperience = new Date().getFullYear() - createdYear;

    res.json({
      repos: user.repositories.totalCount,
      totalContributions: calendar.totalContributions,
      totalCommits: user.contributionsCollection.totalCommitContributions,
      yearsExperience,
      followers: user.followers.totalCount,
      contributionGrid,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GitHub data', details: error.message });
  }
}
