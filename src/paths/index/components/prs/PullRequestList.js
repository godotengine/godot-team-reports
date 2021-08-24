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
            vertical-align: bottom;
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
            flex-direction: column;
            font-size: 13px;
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
        this._showDraft = false;
    }

    onSortClicked(sortOrder, event) {
        this._sortBy = sortOrder;
        this.requestUpdate();
    }

    onDraftsChecked(event) {
        this._showDraft = event.target.checked;
        this.requestUpdate();
    }

    render(){
        let pulls = [].concat(this.pulls);
        pulls.sort((a, b) => {
            if (this._sortBy === "stale") {
                if (a.updated_at > b.updated_at) return 1;
                if (a.updated_at < b.updated_at) return -1;
                return 0;
            } else { // "age" is default.
                if (a.created_at > b.created_at) return 1;
                if (a.created_at < b.created_at) return -1;
                return 0;
            }
        });

        if (!this._showDraft) {
            pulls = pulls.filter((item) => {
               return !item.is_draft;
            });
        }

        const total_pulls = this.pulls.length;
        const filtered_pulls = pulls.length

        return html`
            <div class="team-pulls">
                <div class="team-pulls-toolbar">
                    <span class="pulls-count">
                        <span>PRs to review: </span>
                        <strong>${filtered_pulls}</strong>
                        ${(filtered_pulls !== total_pulls) ? html`
                            <span class="pulls-count-total"> (out of ${total_pulls})</span>
                        ` : ''
                        }
                    </span>
                    
                    <span class="pulls-filters">
                        <span class="pulls-filter">
                            <label for="show-drafts">show drafts? </label>
                            <input
                                id="show-drafts"
                                type="checkbox"
                                @click="${this.onDraftsChecked}"
                            />
                        </span>
                        
                        <span class="pulls-sort">
                            <span>sort by: </span>
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