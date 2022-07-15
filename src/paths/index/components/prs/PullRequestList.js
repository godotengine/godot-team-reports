import { LitElement, html, css, customElement, property } from 'lit-element';

import PullRequestItem from "./PullRequestItem";

@customElement('gr-pull-list')
export default class PullRequestList extends LitElement {
    static get styles() {
        return css`
          /** Colors and variables **/
          :host {
            --pulls-background-color: #e5edf8;
            --pulls-toolbar-color: #9bbaed;
            --pulls-toolbar-accent-color: #5a6f90;

            --sort-color: #5c7bb6;
            --sort-color-hover: #2862cd;
            --sort-color-active: #2054b5;

            --reset-color: #4e4f53;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --pulls-background-color: #191d23;
              --pulls-toolbar-color: #222c3d;
              --pulls-toolbar-accent-color: #566783;

              --sort-color: #4970ad;
              --sort-color-hover: #5b87de;
              --sort-color-active: #6b9aea;

              --reset-color: #7f8185;
            }
          }

          /** Component styling **/
          :host {
            flex-grow: 1;
          }

          :host input[type=checkbox] {
            margin: 0;
            vertical-align: bottom;
          }

          :host select {
            background: var(--pulls-background-color);
            border: 1px solid var(--pulls-background-color);
            color: var(--g-font-color);
            font-size: 12px;
            outline: none;
            min-width: 60px;
          }

          :host .team-pulls {
            background-color: var(--pulls-background-color);
            border-radius: 0 4px 4px 0;
            padding: 8px 12px;
            max-width: 760px;
            min-height: 200px;
          }

          :host .team-pulls-toolbar {
            background: var(--pulls-toolbar-color);
            border-radius: 4px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 10px 14px;
            margin-bottom: 6px;
          }

          :host .pulls-count {
            font-size: 15px;
          }
          :host .pulls-count strong {
            font-size: 18px;
          }
          :host .pulls-count-total {
            color: var(--dimmed-font-color);
          }

          :host .pulls-filters {
            display: flex;
            flex-direction: row;
          }
          :host .pulls-filters-column {
            display: flex;
            flex-direction: column;
            font-size: 13px;
            min-width: 140px;
          }
          :host .pulls-filters-column + .pulls-filters-column {
            margin-left: 38px;
          }

          :host .pulls-filter {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 1px 0;
          }

          :host .pulls-sort {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 1px 0;
          }

          :host .pulls-sort-action {
            color: var(--sort-color);
            cursor: pointer;
          }
          :host .pulls-sort-action:hover {
            color: var(--sort-color-hover);
          }

          :host .pulls-sort-action--active,
          :host .pulls-sort-action--active:hover {
            color: var(--sort-color-active);
            cursor: default;
            text-decoration: underline;
          }

          :host .pulls-reset {
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid var(--pulls-toolbar-accent-color);
            margin-top: 8px;
            padding-top: 2px;
          }

          :host .pulls-reset-action {
            color: var(--reset-color);
            cursor: pointer;
          }

          @media only screen and (max-width: 900px) {
            :host .team-pulls {
              padding: 8px;
              max-width: 95%;
              margin: 0px auto;
            }
            :host .team-pulls-toolbar {
              flex-wrap: wrap;
            }
            :host .pulls-count {
              font-size: 17px;
              margin-bottom: 12px;
              text-align: center;
              width: 100%;
            }
            :host .pulls-count strong {
              font-size: 20px;
            }
            :host .pulls-filters {
              width: 100%;
              justify-content: space-between;
            }

            :host .pulls-filters-column {
                font-size: 15px;
            }
            :host .pulls-filters-column > span {
                padding: 2px 0;
            }
            :host .pulls-filter > *:first-child,
            :host .pulls-sort > *:first-child {
                padding-right: 12px;
            }
          }
        `;
    }

    @property({ type: Array }) pulls = [];
    @property({ type: Object }) teams = {};
    @property( { type: String }) selected_group = "";
    @property({ type: Boolean }) selected_is_person = false;
    @property({ type: Object }) authors = {};

    constructor() {
        super();

        // Look in global.js for the actual defaults.
        this._sortBy          = "age";
        this._sortDirection   = "desc";
        this._showDraft       = false;
        this._filterMilestone = "4.0";
        this._filterMergeable = "";

        this.restoreUserPreferences();
    }

    restoreUserPreferences() {
        const userPreferences = greports.util.getLocalPreferences();

        this._sortBy          = userPreferences["sortBy"];
        this._sortDirection   = userPreferences["sortDirection"];
        this._showDraft       = userPreferences["showDraft"];
        this._filterMilestone = userPreferences["filterMilestone"];
        this._filterMergeable = userPreferences["filterMergeable"];
    }

    saveUserPreferences() {
        const currentPreferences = {
            "sortBy":          this._sortBy,
            "sortDirection":   this._sortDirection,
            "showDraft":       this._showDraft,
            "filterMilestone": this._filterMilestone,
            "filterMergeable": this._filterMergeable,
        };

        greports.util.setLocalPreferences(currentPreferences);
    }

    onResetPreferencesClicked() {
        greports.util.resetLocalPreferences();

        this.restoreUserPreferences();
        this.requestUpdate();
    }

    onSortClicked(sortField, event) {
        this._sortBy = sortField;

        this.saveUserPreferences();
        this.requestUpdate();
    }

    onSortDirectionClicked(sortDirection, event) {
        this._sortDirection = sortDirection;

        this.saveUserPreferences();
        this.requestUpdate();
    }

    onDraftsChecked(event) {
        this._showDraft = event.target.checked;

        this.saveUserPreferences();
        this.requestUpdate();
    }

    onMilestoneChanged(event) {
        this._filterMilestone = event.target.value;

        this.saveUserPreferences();
        this.requestUpdate();
    }

    onMergeableChanged(event) {
        this._filterMergeable = event.target.value;

        this.saveUserPreferences();
        this.requestUpdate();
    }

    getMergeableFilterValue(state, reason) {
        const descriptions = {
            'UNKNOWN':     "unknown",

            'CONFLICTING': "no",
            'MERGEABLE':   "yes",
        };

        if (typeof descriptions[state] === "undefined") {
            return "unknown";
        }

        if (state === 'MERGEABLE' && ![ 'CLEAN', 'HAS_HOOKS', 'UNSTABLE' ].includes(reason)) {
            return "maybe";
        }
        return descriptions[state];
    }

    render(){
        const milestones = [];

        let pulls = [].concat(this.pulls);

        const sort_direction = (this._sortDirection === "desc" ? 1 : -1);
        pulls.sort((a, b) => {
            if (a.milestone && !milestones.includes(a.milestone.title)) {
                milestones.push(a.milestone.title);
            }
            if (b.milestone && !milestones.includes(b.milestone.title)) {
                milestones.push(b.milestone.title);
            }

            if (this._sortBy === "stale") {
                if (a.updated_at > b.updated_at) return 1 * sort_direction;
                if (a.updated_at < b.updated_at) return -1 * sort_direction;
                return 0;
            } else { // "age" is default.
                if (a.created_at > b.created_at) return 1 * sort_direction;
                if (a.created_at < b.created_at) return -1 * sort_direction;
                return 0;
            }
        });

        // Values can be dynamically removed from the selector,
        // but we don't really want to break the filters.
        let milestone = "";
        if (milestones.includes(this._filterMilestone)) {
            milestone = this._filterMilestone;
        }

        let mergeables = [
            "no", "maybe", "yes"
        ];

        pulls = pulls.filter((item) => {
            if (!this._showDraft && item.is_draft) {
                return false;
            }
            if (milestone !== "" && item.milestone && item.milestone.title !== milestone) {
                return false;
            }
            if (this._filterMergeable !== "" && this.getMergeableFilterValue(item.mergeable_state, item.mergeable_reason) !== this._filterMergeable) {
                return false;
            }
            return true;
        });

        const total_pulls = this.pulls.length;
        const filtered_pulls = pulls.length

        return html`
            <div class="team-pulls">
                <div class="team-pulls-toolbar">
                    <div class="pulls-count">
                        <span>PRs to review: </span>
                        <strong>${filtered_pulls}</strong>
                        ${(filtered_pulls !== total_pulls) ? html`
                            <span class="pulls-count-total"> (out of ${total_pulls})</span>
                        ` : ''
                        }
                    </div>

                    <div class="pulls-filters">
                        <span class="pulls-filters-column">
                            <span class="pulls-filter">
                                <label for="show-drafts">show drafts? </label>
                                <input
                                    id="show-drafts"
                                    type="checkbox"
                                    .checked="${this._showDraft}"
                                    @click="${this.onDraftsChecked}"
                                />
                            </span>

                            <span class="pulls-filter">
                                <span>milestone: </span>
                                <select @change="${this.onMilestoneChanged}">
                                    <option value="">*</option>
                                    ${milestones.map((item) => {
                                        return html`
                                            <option
                                                value="${item}"
                                                .selected="${milestone === item}"
                                            >
                                                ${item}
                                            </option>
                                        `
                                    })}
                                </select>
                            </span>

                            <span class="pulls-filter">
                                <span>mergeable: </span>
                                <select @change="${this.onMergeableChanged}">
                                    <option value="">*</option>
                                    ${mergeables.map((item) => {
                                        return html`
                                            <option
                                                value="${item}"
                                                .selected="${this._filterMergeable === item}"
                                            >
                                                ${item}
                                            </option>
                                        `
                                    })}
                                </select>
                            </span>
                        </span>

                        <span class="pulls-filters-column">
                            <span class="pulls-sort">
                                <span>sort by: </span>
                                <span>
                                    <span
                                        class="pulls-sort-action ${(this._sortBy === "age" ? "pulls-sort-action--active" : "")}"
                                        title="Show older PRs first"
                                        @click="${this.onSortClicked.bind(this, "age")}"
                                    >
                                        lifetime
                                    </span> ·
                                    <span
                                        class="pulls-sort-action ${(this._sortBy === "stale" ? "pulls-sort-action--active" : "")}"
                                        title="Show least recently updated PRs first"
                                        @click="${this.onSortClicked.bind(this, "stale")}"
                                    >
                                        stale
                                    </span>
                                </span>
                            </span>

                            <span class="pulls-sort">
                                <span></span>
                                <span>
                                    <span
                                        class="pulls-sort-action ${(this._sortDirection === "asc" ? "pulls-sort-action--active" : "")}"
                                        title="Show newer PRs first"
                                        @click="${this.onSortDirectionClicked.bind(this, "asc")}"
                                    >
                                        asc
                                    </span> ·
                                    <span
                                        class="pulls-sort-action ${(this._sortDirection === "desc" ? "pulls-sort-action--active" : "")}"
                                        title="Show older PRs first"
                                        @click="${this.onSortDirectionClicked.bind(this, "desc")}"
                                    >
                                        desc
                                    </span>
                                </span>
                            </span>

                            <span class="pulls-reset">
                                <span
                                    class="pulls-reset-action"
                                    @click="${this.onResetPreferencesClicked}"
                                >
                                    reset filters
                                </span>
                            </span>
                        </span>
                    </div>
                </div>

                ${pulls.map((item) => {
                    const other_teams = [];
                    item.teams.forEach((teamId) => {
                        if (teamId === "") {
                            return; // continue
                        }

                        if (
                            this.selected_is_person
                            || (!this.selected_is_person && teamId !== this.selected_group)
                        ) {
                            other_teams.push(
                                this.teams[teamId].name
                            );
                        }
                    });

                    let author = null;
                    if (typeof this.authors[item.authored_by] != "undefined") {
                        author = this.authors[item.authored_by];
                    }

                    return html`
                        <gr-pull-request
                            .id="${item.public_id}"
                            .title="${item.title}"
                            .url="${item.url}"
                            ?draft="${item.is_draft}"
                            .mergeable_state="${item.mergeable_state}"
                            .mergeable_reason="${item.mergeable_reason}"

                            .labels="${item.labels}"
                            .milestone="${item.milestone}"
                            .branch="${item.target_branch}"
                            .links="${item.links}"

                            .created_at="${item.created_at}"
                            .updated_at="${item.updated_at}"
                            .author="${author}"

                            .diff_url="${item.diff_url}"
                            .patch_url="${item.patch_url}"

                            .teams="${other_teams}"
                        />
                    `;
                 })}
            </div>
        `;
    }
}