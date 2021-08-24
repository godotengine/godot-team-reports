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
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --pulls-background-color: #191d23;
              --pulls-toolbar-color: #222c3d;
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
            font-size: 15px;
            padding: 10px 14px;
            margin-bottom: 6px;
          }
          
          :host .pulls-count {
            
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
            color: var(--link-font-color);
            cursor: pointer;
          }
          :host .pulls-sort-action:hover {
            color: var(--link-font-color-hover);
          }
          
          :host .pulls-sort-action--active,
          :host .pulls-sort-action--active:hover {
            color: var(--link-font-color-inactive);
            cursor: default;
          }
        `;
    }

    @property({ type: Array }) pulls = [];
    @property({ type: Object }) teams = {};
    @property({ type: Object }) authors = {};

    constructor() {
        super();

        this._sortBy = "age";
        this._sortDirection = "desc";
        this._showDraft = false;
        this._filterMilestone = "";
    }

    onSortClicked(sortField, event) {
        this._sortBy = sortField;
        this.requestUpdate();
    }

    onSortDirectionClicked(sortDirection, event) {
        this._sortDirection = sortDirection;
        this.requestUpdate();
    }

    onDraftsChecked(event) {
        this._showDraft = event.target.checked;
        this.requestUpdate();
    }

    onMilestoneChanged(event) {
        this._filterMilestone = event.target.value;
        this.requestUpdate();
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

        if (!milestones.includes(this._filterMilestone)) {
            this._filterMilestone = "";
        }

        pulls = pulls.filter((item) => {
            if (!this._showDraft && item.is_draft) {
                return false;
            }
            if (this._filterMilestone !== "" && item.milestone && item.milestone.title !== this._filterMilestone) {
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
                                        @click="${this.onDraftsChecked}"
                                />
                            </span>
                            
                            <span class="pulls-filter">
                                <span>milestone: </span>
                                <select @change="${this.onMilestoneChanged}">
                                    <option value="">*</option>
                                    ${milestones.map((item) => {
                                        return html`
                                            <option value="${item}">${item}</option>
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
                        </span>
                    </div>
                </div>
                
                ${pulls.map((item) => {
                    const other_teams = [];
                    item.teams.forEach((teamId) => {
                        if (teamId !== this._selectedTeam) {
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

                            .labels="${item.labels}"
                            .milestone="${item.milestone}"
                            .branch="${item.target_branch}"

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