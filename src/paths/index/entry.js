import { LitElement, html, css, customElement, property } from 'lit-element';

import PageContent from 'src/shared/components/PageContent';
import TeamTab from "src/shared/components/TeamTab";
import PullRequestItem from "src/shared/components/PullRequestItem";

@customElement('entry-component')
export default class EntryComponent extends LitElement {
    static get styles() {
        return css`
          /** Colors and variables **/
          :host {
            --teams-border-color: #515c6c;
            --pulls-background-color: #191d23;
            --pulls-toolbar-color: #222c3d;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --teams-border-color: #515c6c;
              --pulls-background-color: #191d23;
              --pulls-toolbar-color: #222c3d;
            }
          }
          
          /** Component styling **/
          :host {
          }
          
          :host p {
            line-height: 22px;
          }
          
          :host .teams {
            display: flex;
            padding: 24px 0;
          }

          :host .team-tabs {
            border-right: 2px solid var(--teams-border-color);
            width: 240px;
          }
          
          :host .team-tabs h4 {
            margin: 0 0 12px 0;
          }
          
          :host .team-pulls {
            background-color: var(--pulls-background-color);
            border-radius: 0 4px 4px 0;
            flex-grow: 1;
            padding: 8px 12px;
            max-width: 760px;
          }
          
          :host .team-pulls-toolbar {
            background: var(--pulls-toolbar-color);
            border-radius: 4px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-size: 14px;
            padding: 10px 14px;
            margin-bottom: 6px;
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

    @property({ type: Date }) generated_at = null;
    @property({ type: Object }) teams = {};
    @property({ type: Array }) pulls = [];

    constructor() {
        super();

        this._entryRequested = false;
        this._selectedTeam = -1;
        this._sortBy = "age";
        this._requestData();
    }

    performUpdate() {
        this._requestData();
        super.performUpdate();
    }

    async _requestData() {
        if (this._entryRequested) {
            return;
        }
        this._entryRequested = true;
        const data = await greports.api.getData();

        if (data) {
            this.generated_at = data.generated_at;
            this.teams = data.teams;
            this.pulls = data.pulls;

            const teams = Object.values(this.teams);
            teams.sort((a, b) => {
                if (a.full_name > b.full_name) return 1;
                if (a.full_name < b.full_name) return -1;
                return 0;
            });
            if (teams.length) {
                this._selectedTeam = teams.length ? teams[0].id : -1;
            }
        } else {
            this.generated_at = null;
            this.teams = {};
            this.pulls = [];
            this._selectedTeam = -1;
        }
    }

    onTabClicked(tabId, event) {
        this._selectedTeam = tabId;
        this.requestUpdate();
    }

    onSortClicked(sortOrder, event) {
        this._sortBy = sortOrder;
        this.requestUpdate();
    }

    render(){
        let teams = Object.values(this.teams);
        teams.sort((a, b) => {
            if (a.full_name > b.full_name) return 1;
            if (a.full_name < b.full_name) return -1;
            return 0;
        });

        let pulls = [];
        if (this._selectedTeam >= 0) {
            this.pulls.forEach((pull) => {
               if (pull.teams.includes(this._selectedTeam)) {
                   pulls.push(pull);
               }
            });
        }

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

        return html`
            <page-content>
                <h1>
                    Godot Team Reports
                </h1>
                <p>
                    This page lists all open pull-requests (PRs) assigned to every core maintenance team.
                    <br/>
                    Contributors are encouraged to collaborate and clear the backlog by giving these PRs a proper look
                    and either accepting or rejecting them.
                    <br/>
                    Positively reviewed PRs are open to be merged by responsible maintainers.
                </p>

                <div class="teams">
                    <div class="team-tabs">
                        <h4>Teams:</h4>
                        
                        ${teams.map((item) => {
                            return html`
                                <gr-team-tab
                                    .id="${item.id}"
                                    .name="${item.name}"
                                    .avatar="${item.avatar}"
                                    ?active="${this._selectedTeam === item.id}"
                                    @click="${this.onTabClicked.bind(this, item.id)}"
                                />
                            `;
                        })}
                    </div>
                    <div class="team-pulls">
                        <div class="team-pulls-toolbar">
                            <span>
                                <span>PRs to review: </span>
                                <strong>${pulls.length}</strong>
                            </span>
                            <span class="pulls-sort">
                                <span>Sort by: </span>
                                <span
                                    class="pulls-sort-action ${(this._sortBy === "age" ? "pulls-sort-action--active" : "")}"
                                    title="Show older PRs first"
                                    @click="${this.onSortClicked.bind(this, "age")}"
                                >
                                    Age
                                </span> |
                                <span
                                    class="pulls-sort-action ${(this._sortBy === "stale" ? "pulls-sort-action--active" : "")}"
                                    title="Show least recently updated PRs first"
                                    @click="${this.onSortClicked.bind(this, "stale")}"
                                >
                                    Stale
                                </span>
                            </span>
                        </div>
                        
                        ${pulls.map((item) => {
                            let other_teams = [];
                            item.teams.forEach((teamId) => {
                                if (teamId !== this._selectedTeam) {
                                    other_teams.push(
                                      this.teams[teamId].name
                                    );
                                }
                            });
                            
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

                                    .diff_url="${item.diff_url}"
                                    .patch_url="${item.patch_url}"
                                    
                                    .teams="${other_teams}"
                                />
                            `;
                        })}
                    </div>
                </div>
            </page-content>
        `;
    }
}