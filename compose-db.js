const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

const teams = {};
const authors = {};
const pulls = [];
let page_count = 1;

const LINK_RE = /&page=([0-9]+)/g;

async function fetchPulls(page) {
    try {
        let page_text = page;
        if (page_count > 1) {
            page_text = `${page}/${page_count}`;
        }
        console.log(`    Requesting page ${page_text} of pull request data.`);
        const res = await fetch(`https://api.github.com/repos/godotengine/godot/pulls?state=open&per_page=100&page=${page}`);
        if (res.status !== 200) {
            return [];
        }

        const links = res.headers.get("link").split(",");
        links.forEach((link) => {
           if (link.includes('rel="last"')) {
               const matches = LINK_RE.exec(link);
               if (matches && matches[1]) {
                   page_count = Number(matches[1]);
               }
           }
        });

        return await res.json();
    } catch (err) {
        console.error("Error fetching pull request data: " + err);
        return [];
    }
}

function processPulls(pullsRaw) {
    console.log("    Processing retrieved pull requests.");
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
            "authored_by": null,
            "created_at": item.created_at,
            "updated_at": item.updated_at,

            "target_branch": item.base.ref,

            "labels": [],
            "milestone": null,

            "teams": [],
        };

        // Compose and link author information.
        const author = {
            "id": item.user.id,
            "user": item.user.login,
            "avatar": item.user.avatar_url,
            "url": item.user.html_url,
            "pull_count": 0,
        };
        pr.authored_by = author.id;

        // Store the author if they haven't been stored.
        if (typeof authors[author.id] == "undefined") {
            authors[author.id] = author;
        }
        authors[author.id].pull_count++;

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
        if (item.requested_teams.length > 0) {
            item.requested_teams.forEach((teamItem) => {
                const team = {
                    "id": teamItem.id,
                    "name": teamItem.name,
                    "avatar": `https://avatars.githubusercontent.com/t/${teamItem.id}?s=40&v=4`,
                    "slug": teamItem.slug,
                    "full_name": teamItem.name,
                    "full_slug": teamItem.slug,
                    "pull_count": 0,
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
                teams[team.id].pull_count++;

                // Reference the team.
                pr.teams.push(team.id);
            });
        } else {
            // If there are no teams, use a fake "empty" team to track those PRs as well.
            const team = {
                "id": -1,
                "name": "No team assigned",
                "avatar": "",
                "slug": "_",
                "full_name": "No team assigned",
                "full_slug": "_",
                "pull_count": 0,
            };

            // Store the team if it hasn't been stored before.
            if (typeof teams[team.id] == "undefined") {
                teams[team.id] = team;
            }
            teams[team.id].pull_count++;

            // Reference the team.
            pr.teams.push(team.id);
        }

        pulls.push(pr);
    });
}

async function main() {
    console.log("[*] Building local pull request database.");

    console.log("[*] Fetching pull request data from GitHub.");
    // Pages are starting with 1 (but 0 returns the same results).
    let page = 1;
    while (page <= page_count) {
        const pullsRaw = await fetchPulls(page);
        processPulls(pullsRaw);
        page++;
    }

    console.log("[*] Finalizing database.")
    const output = {
        "generated_at": Date.now(),
        "teams": teams,
        "authors": authors,
        "pulls": pulls,
    };
    try {
        console.log("[*] Storing database to file.")
        await fs.writeFile("out/data.json", JSON.stringify(output), {encoding: "utf-8"});
    } catch (err) {
        console.error("Error saving database file: " + err);
    }
}

main();
