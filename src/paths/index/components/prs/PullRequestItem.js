import { LitElement, html, css, customElement, property } from 'lit-element';

@customElement('gr-pull-request')
export default class PullRequestItem extends LitElement {
    static get styles() {
        return css`
          /** Colors and variables **/
          :host {
            --pr-border-color: #fcfcfa;
            --draft-font-color: #ffcc31;
            --draft-background-color: #9db3c0;
            --stats-background-color: #f9fafa;
            --ghost-font-color: #738b99;

            --mergeable-unknown-color: #939fa3;
            --mergeable-no-color: #de1600;
            --mergeable-maybe-color: #c49504;
            --mergeable-yes-color: #50b923;

            --stat-temp0-color: #000000;
            --stat-temp1-color: #383824;
            --stat-temp2-color: #645b2c;
            --stat-temp3-color: #a07b24;
            --stat-temp4-color: #b06c15;
            --stat-temp5-color: #bb5010;
            --stat-temp6-color: #e33b07;
            --stat-temp7-color: #e6240e;
            --stat-temp8-color: #b31605;
            --stat-temp9-color: #d3001c;
          }

          @media (prefers-color-scheme: dark) {
            :host {
              --pr-border-color: #0d1117;
              --draft-font-color: #e0c537;
              --draft-background-color: #1e313c;
              --stats-background-color: #0f1316;
              --ghost-font-color: #495d68;

              --mergeable-unknown-color: #4e5659;
              --mergeable-no-color: #d31a3b;
              --mergeable-maybe-color: #cbad1c;
              --mergeable-yes-color: #3bc213;

              --stat-temp0-color: #ffffff;
              --stat-temp1-color: #f0ed7e;
              --stat-temp2-color: #f5d94a;
              --stat-temp3-color: #f8b71e;
              --stat-temp4-color: #f38c06;
              --stat-temp5-color: #f06009;
              --stat-temp6-color: #e33b07;
              --stat-temp7-color: #e6240e;
              --stat-temp8-color: #b31605;
              --stat-temp9-color: #d3001c;
            }
          }

          /** Component styling **/
          :host {
            border-bottom: 3px solid var(--pr-border-color);
            display: block;
            padding: 14px 12px 20px 12px;
          }

          :host a {
            color: var(--link-font-color);
            text-decoration: none;
          }
          :host a:hover {
            color: var(--link-font-color-hover);
          }

          :host .pr-title {
            display: inline-block;
            font-size: 20px;
            margin-top: 6px;
            margin-bottom: 12px;
          }
          :host .pr-title-name {
            color: var(--g-font-color);
            line-height: 24px;
            word-break: break-word;
          }

          :host .pr-title-draft {
            background-color: var(--draft-background-color);
            border-radius: 6px 6px;
            color: var(--draft-font-color);
            font-size: 14px;
            padding: 1px 6px;
            vertical-align: bottom;
          }

          :host .pr-meta {
            color: var(--dimmed-font-color);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-size: 13px;
          }

          :host .pr-labels {
            display: flex;
            flex-flow: column wrap;
            padding: 4px 0;
            max-height: 60px;
          }

          :host .pr-label {
            padding-right: 8px;
          }
          :host .pr-label-dot {
            border-radius: 4px;
            box-shadow: rgb(0 0 0 / 28%) 0 0 3px 0;
            display: inline-block;
            width: 8px;
            height: 8px;
          }
          :host .pr-label-name {
            padding-left: 3px;
          }

          :host .pr-milestone-value {
            font-weight: 700;
          }

          :host .pr-mergeable-value,
          :host .pr-mergeable-reason {
            border-bottom: 1px dashed var(--g-font-color);
            cursor: help;
            font-weight: 700;
          }

          :host .pr-mergeable-value--unknown {
            color: var(--mergeable-unknown-color);
          }
          :host .pr-mergeable-value--no {
            color: var(--mergeable-no-color);
          }
          :host .pr-mergeable-value--maybe {
            color: var(--mergeable-maybe-color);
          }
          :host .pr-mergeable-value--yes {
            color: var(--mergeable-yes-color);
          }

          :host .pr-time {

          }
          :host .pr-time-value {
            border-bottom: 1px dashed var(--g-font-color);
            cursor: help;
            font-weight: 700;
          }

          :host .pr-author {

          }
          :host .pr-author-value {

          }
          :host .pr-author-value--hot:before {
            content: "★";
            color: var(--draft-font-color);
          }
          :host .pr-author-value--ghost {
            color: var(--ghost-font-color);
            font-weight: 600;
          }

          :host .pr-links {
            font-size: 13px;
            margin-top: 8px;
          }

          :host .pr-link {
            font-weight: 700;
            white-space: nowrap;
          }

          :host .pr-stats {
            background-color: var(--stats-background-color);
            border-radius: 4px;
            display: flex;
            justify-content: space-around;
            padding: 10px 6px;
            margin-top: 12px;
          }

          :host .pr-stat + .pr-stat {
            margin-left: 12px;
          }

          :host .pr-stat--temp0 {
            color: var(--stat-temp0-color);
          }
          :host .pr-stat--temp1 {
            color: var(--stat-temp1-color);
          }
          :host .pr-stat--temp2 {
            color: var(--stat-temp2-color);
          }
          :host .pr-stat--temp3 {
            color: var(--stat-temp3-color);
          }
          :host .pr-stat--temp4 {
            color: var(--stat-temp4-color);
          }
          :host .pr-stat--temp5 {
            color: var(--stat-temp5-color);
            font-weight: 700;
          }
          :host .pr-stat--temp6 {
            color: var(--stat-temp6-color);
            font-weight: 700;
          }
          :host .pr-stat--temp7 {
            color: var(--stat-temp7-color);
            font-weight: 700;
          }
          :host .pr-stat--temp8 {
            color: var(--stat-temp8-color);
            font-weight: 700;
          }
          :host .pr-stat--temp9 {
            color: var(--stat-temp9-color);
            font-weight: 700;
          }

          :host .pr-review {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            margin-top: 14px;
          }

          :host .pr-review-teams {
            max-width: 50%;
          }

          :host .pr-review-team {
            color: var(--light-font-color);
            white-space: nowrap;
          }
          :host .pr-review-team + .pr-review-team:before {
            content: "· ";
            white-space: break-spaces;
          }

          @media only screen and (max-width: 900px) {
            :host {
              padding: 14px 0 20px 0;
            }
            :host .pr-meta {
              flex-wrap: wrap;
            }
            :host .pr-labels {
              width: 100%;
              justify-content: space-between;
            }
          }
        `;
    }

    @property({ type: String }) id = '';
    @property({ type: String }) title = '';
    @property({ type: String, reflect: true }) url = '';
    @property({ type: String, reflect: true }) diff_url = '';
    @property({ type: String, reflect: true }) patch_url = '';
    @property({ type: Boolean }) draft = false;
    @property({ type: String }) mergeable_state = '';
    @property({ type: String }) mergeable_reason = '';
    @property({ type: Array }) labels = [];
    @property({ type: String, reflect: true }) milestone = '';
    @property({ type: String, reflect: true }) branch = '';
    @property({ type: Array }) links = [];
    @property({ type: String }) created_at = '';
    @property({ type: String }) updated_at = '';
    @property({ type: Object }) author = null;
    @property({ type: Array }) teams = [];



    getStatTemp(value, factor) {
        let temp = Math.floor(value / factor);
        if (temp > 9) {
            temp = 9;
        }

        return temp;
    }

    getMergeableStateText(value, reason) {
        const descriptions = {
            'UNKNOWN':     "unknown",

            'CONFLICTING': "no",
            'MERGEABLE':   "yes",
        };

        if (typeof descriptions[value] === "undefined") {
            return value.toLowerCase;
        }

        if (value === 'MERGEABLE' && ![ 'CLEAN', 'HAS_HOOKS', 'UNSTABLE' ].includes(reason)) {
            return "maybe";
        }
        return descriptions[value];
    }

    getMergeableStateDescription(value) {
        const descriptions = {
            'UNKNOWN':     "The mergeability of the pull request is not calculated.",

            'CONFLICTING': "The pull request cannot be merged due to merge conflicts.",
            'MERGEABLE':   "The pull request can be merged.",
        };

        if (typeof descriptions[value] === "undefined") {
            return value;
        }
        return descriptions[value];
    }

    getMergeableReasonText(value) {
        const descriptions = {
            'UNKNOWN':   "unknown",

            'BEHIND':    "outdated branch",
            'BLOCKED':   "blocked",
            'CLEAN':     "clean",
            'DIRTY':     "merge conflicts",
            'DRAFT':     "draft",
            'HAS_HOOKS': "passing status w/ hooks",
            'UNSTABLE':  "non-passing status",
        };

        if (typeof descriptions[value] === "undefined") {
            return value;
        }
        return descriptions[value];
    }

    getMergeableReasonDescription(value) {
        const descriptions = {
            'UNKNOWN':   "The state cannot currently be determined.",

            'BEHIND':    "The head ref is out of date.",
            'BLOCKED':   "The merge is blocked. It likely requires an approving review.",
            'CLEAN':     "Mergeable and passing commit status.",
            'DIRTY':     "The merge commit cannot be cleanly created.",
            'DRAFT':     "The merge is blocked due to the pull request being a draft.",
            'HAS_HOOKS': "Mergeable with passing commit status and pre-receive hooks.",
            'UNSTABLE':  "Mergeable with non-passing commit status.",
        };

        if (typeof descriptions[value] === "undefined") {
            return value;
        }
        return descriptions[value];
    }

    render(){
        const created_days = greports.format.getDaysSince(this.created_at);
        const stale_days = greports.format.getDaysSince(this.updated_at);

        const other_teams = [].concat(this.teams);
        other_teams.sort((a, b) => {
            const a_name = a.toLowerCase().replace(/^_/, "");
            const b_name = b.toLowerCase().replace(/^_/, "");

            if (a_name > b_name) return 1;
            if (a_name < b_name) return -1;
            return 0;
        });

        const authorClassList = [ "pr-author-value" ];
        if (this.author.pull_count > 40) {
            authorClassList.push("pr-author-value--hot");
        }
        if (this.author.id === "") {
            authorClassList.push("pr-author-value--ghost");
        }

        // Keep it to two columns, but if there isn't enough labels, keep it to one.
        let labels_height = Math.ceil(this.labels.length / 2) * 20;
        if (labels_height < 60) {
            labels_height = 60;
        }

        return html`
            <div class="pr-container">
                <a
                    class="pr-title"
                    href="${this.url}"
                    target="_blank"
                >
                    ${(this.draft ? html`
                        <span class="pr-title-draft">draft</span>
                    ` : '')}
                    <span class="pr-title-id">#${this.id}</span> <span class="pr-title-name">${this.title}</span>
                </a>

                <div class="pr-meta">
                    <div class="pr-labels" style="max-height:${labels_height}px">
                        ${this.labels.map((item) => {
                            return html`
                                <span
                                    class="pr-label"
                                >
                                    <span
                                        class="pr-label-dot"
                                        style="background-color: ${item.color}"
                                    ></span>
                                    <span
                                        class="pr-label-name"
                                    >
                                        ${item.name}
                                    </span>
                                </span>
                            `;
                        })}
                    </div>

                    <div class="pr-milestone">
                        <div>
                            <span>milestone: </span>
                            ${(this.milestone != null) ? html`
                                <a
                                    href="${this.milestone.url}"
                                    target="_blank"
                                >
                                    ${this.milestone.title}
                                </a>
                            ` : html`
                                <span>none</span>
                            `}
                        </div>
                        <div>
                            <span>branch: </span>
                            <span class="pr-milestone-value">
                                ${this.branch}
                            </span>
                        </div>
                        <div>
                            <span>mergeable: </span>
                            <span
                                class="pr-mergeable-value pr-mergeable-value--${this.getMergeableStateText(this.mergeable_state, this.mergeable_reason)}"
                                title="${this.getMergeableStateDescription(this.mergeable_state)}"
                            >
                                ${this.getMergeableStateText(this.mergeable_state, this.mergeable_reason)}
                            </span>
                            ${(this.mergeable_reason !== 'UNKNOWN') ? html`
                                |
                                <span
                                        class="pr-mergeable-reason pr-mergeable-reason--${this.mergeable_reason.toLowerCase()}"
                                        title="${this.getMergeableReasonDescription(this.mergeable_reason)}"
                                >
                                    ${this.getMergeableReasonText(this.mergeable_reason)}
                                </span>
                            ` : html``
                            }
                        </div>
                    </div>

                    <div class="pr-timing">
                        <div class="pr-time">
                            <span>created: </span>
                            <span
                                class="pr-time-value"
                                title="${greports.format.formatTimestamp(this.created_at)}"
                            >
                                ${greports.format.formatDate(this.created_at)}
                            </span>
                        </div>
                        <div class="pr-time">
                            <span>updated: </span>
                            <span
                                class="pr-time-value"
                                title="${greports.format.formatTimestamp(this.updated_at)}"
                            >
                                ${greports.format.formatDate(this.updated_at)}
                            </span>
                        </div>
                        <div class="pr-author">
                            <span>author: </span>
                            <a
                                class="${authorClassList.join(" ")}"
                                href="https://github.com/godotengine/godot/pulls/${this.author.user}"
                                target="_blank"
                                title="Open ${this.author.pull_count} ${(this.author.pull_count > 1) ? 'PRs' : 'PR'} by ${this.author.user}"
                            >
                                ${this.author.user}
                            </a>
                        </div>
                    </div>
                </div>

                ${(this.links.length > 0 ? html`
                    <div class="pr-links">
                        <span>linked issues: </span>
                        ${this.links.map((item, index) => {
                            let issueRef = "#" + item.issue;
                            if (item.repo !== "godotengine/godot") {
                                issueRef = item.repo + issueRef;
                            }

                            return html`
                                ${(index > 0 ? html`
                                    <span> · </span>
                                ` : '')}
                                <a
                                    class="pr-link"
                                    href="${item.url}"
                                    target="_blank"
                                    title="Open the issue ${issueRef} which this PR ${item.keyword}"
                                >
                                    ${issueRef}
                                </a>
                            `
                        })}
                    </div>
                ` : '')}

                <div class="pr-stats">
                    <div
                        class="pr-stat"
                        title="Days since this PR was created"
                    >
                        <span>lifetime: </span>
                        <span
                            class="pr-stat--temp${this.getStatTemp(created_days, 14)}"
                        >
                            ${greports.format.formatDays(created_days)}
                        </span>
                    </div>
                    <div
                        class="pr-stat"
                        title="Days since last update to this PR was made"
                    >
                        <span>stale for: </span>
                        <span
                            class="pr-stat--temp${this.getStatTemp(stale_days, 14)}"
                        >
                            ${greports.format.formatDays(stale_days)}
                        </span>
                    </div>
                </div>

                <div class="pr-review">
                    <div class="pr-review-teams">
                        ${(other_teams.length > 0) ? html`
                            <span>also awaiting reviews from: </span>
                            ${other_teams.map((item) => {
                                return html`
                                    <span class="pr-review-team">${item}</span>
                                `;
                            })}
                        ` : ''}
                    </div>
                    <div class="pr-download">
                        <span>download changeset: </span>
                        <a
                            href="${this.diff_url}"
                            target="_blank"
                        >
                            diff
                        </a> |
                        <a
                            href="${this.patch_url}"
                            target="_blank"
                        >
                            patch
                        </a>
                    </div>

                </div>
            </div>
        `;
    }
}