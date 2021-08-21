const fs = require('fs').promises;
const path = require('path');

async function fetchPulls() {
    try {
        const json = await fs.readFile("pulls.raw.json", {encoding: "utf-8", flag: "r"});
        return JSON.parse(json);
    } catch (err) {
        console.error("Error fetching the pull requests: " + err);
        return {};
    }
}

async function processPulls() {
    const pullsRaw = await fetchPulls();

    let teams = {};
    let pulls = [];

    pullsRaw.forEach((item) => {
        // Compile basic information about a PR.
        let pr = {
            "id": item.id,
            "public_id": item.number,
            "url": item.html_url,
            "diff_url": item.diff_url,
            "patch_url": item.patch_url,

            "title": item.title,
            "state": item.state,
            "is_draft": item.draft,
            "authored_by": {
                "id": item.user.id,
                "user": item.user.login,
                "avater": item.user.avatar_url,
                "url": item.user.html_url,
            },
            "created_at": item.created_at,
            "updated_at": item.updated_at,
            "body": item.body,

            "target_branch": item.base.ref,

            "labels": [],
            "milestone": null,

            "teams": [],
        };

        // Add the milestone, if available.
        if (item.milestone) {
            pr.milestone = {
                "id": item.milestone.id,
                "title": item.milestone.title,
                "url": item.milestone.html_url,
            };
        }

        // Add labels, if available.
        item.labels.forEach((labelItem) => {
            pr.labels.push({
               "id": labelItem.id,
               "name": labelItem.name,
               "color": "#" + labelItem.color
            });
        });
        pr.labels.sort((a, b) => {
           if (a.name > b.name) return 1;
           if (a.name < b.name) return -1;
           return 0;
        });

        // Add teams, if available.
        item.requested_teams.forEach((teamItem) => {
            let team = {
                "id": teamItem.id,
                "name": teamItem.name,
                "avatar": `https://avatars.githubusercontent.com/t/${teamItem.id}?s=40&v=4`,
                "slug": teamItem.slug,
                "full_name": teamItem.name,
                "full_slug": teamItem.slug,
            };
            // Include parent data into full name and slug.
            if (teamItem.parent) {
                team.full_name = `${teamItem.parent.name}/${team.name}`;
                team.full_slug = `${teamItem.parent.slug}/${team.slug}`;
            }

            // Store the team if it hasn't been stored before.
            if (typeof teams[team.id] == "undefined") {
                teams[team.id] = team;
            }

            // Reference the team.
            pr.teams.push(team.id);
        });

        pulls.push(pr);
    });

    const output = {
        "generated_at": Date.now(),
        "teams": teams,
        "pulls": pulls,
    };
    fs.writeFile("out/data.json", JSON.stringify(output), { encoding: "utf-8" });
}

processPulls();
